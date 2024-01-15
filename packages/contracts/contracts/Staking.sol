// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import {Subcall, StakingAddress} from "@oasisprotocol/sapphire-contracts/contracts/Subcall.sol";

import {EnumerableSet} from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

import {ABDKMathQuad} from "./lib/ABDKMathQuad.sol";

/**
 * @title Minimal Staking Implementation
 *
 * This contract implements delegation and undelegation of the native ROSE token
 * with validators. It encompasses the Oasis specific staking logic.
 */
contract Staking {
    /// Incremented counter to determine receipt IDs
    uint64 private lastReceiptId;

    mapping(uint64 => PendingDelegation) private pendingDelegations;

    /// (from, to) => shares
    mapping(address => mapping(StakingAddress => Delegation)) private delegations;

    /// (receiptId => PendingUndelegation)
    mapping(uint64 => PendingUndelegation) private pendingUndelegations;

    /// (endReceiptId => UndelegationPool)
    mapping(uint64 => UndelegationPool) private undelegationPools;

    /// Set of pending delegation receiptIds per-user
    mapping(address => EnumerableSet.UintSet) private pendingDelegationsByUser;

    /// Set of unique delegates per-user
    mapping(address => EnumerableSet.Bytes32Set) private delegatesByUser;

    /// Set of undelegation receiptIds per-user
    mapping(address => EnumerableSet.UintSet) private undelegationsByUser;

    // -------------------------------------------------------------------------

    struct PendingDelegation {
        address from;
        StakingAddress to;
        uint128 amount;
    }

    struct Delegation {
        uint256 amount;
        uint128 shares;
    }

    struct PendingUndelegation {
        StakingAddress from;
        address payable to;
        uint128 shares;
        uint256 costBasis;
        uint64 endReceiptId;
        uint64 epoch;
    }

    struct UndelegationPool {
        uint128 totalShares;
        uint128 totalAmount;
    }

    // -------------------------------------------------------------------------

    event OnDelegateStart(
        address indexed who,
        StakingAddress to,
        uint256 amount,
        uint64 receiptId
    );

    event OnDelegateDone(uint64 indexed receiptId, address who, uint128 shares);

    event OnUndelegateStart(
        uint64 indexed receiptId,
        address who,
        uint64 epoch,
        uint128 shares
    );

    // -------------------------------------------------------------------------

    /// Receipt is not known, cannot continue with action (e.g. UndelegateStart)
    error UnknownReceipt();

    /// UndelegateDone has been called before UndelegateStart!
    error MustUndelegateStartFirst();

    /// User does not have enough shares to perform the action (e.g. undelegate)
    error NotEnoughShares();

    /// Must undelegate 1 or more shares
    error CannotUndelegateZeroShares();

    // -------------------------------------------------------------------------

    constructor() {
        // Due to an oddity in the oasis-cbor package, we start at 2**32
        // Otherwise uint64 parsing will fail and the message is rejected
        lastReceiptId = 4294967296;
    }

    /**
     * Begin or increase delegation by sending an amount of ROSE to the contract.
     *
     * Delegation will fail if the minimum per-validator amount has not been
     * reached, at the time of writing this is 100 ROSE.
     *
     * See https://docs.oasis.io/node/genesis-doc#delegations.
     *
     * Only one delegation can occur per transaction.
     *
     * @param to Staking address of validator on the consensus layer
     */
    function Delegate(StakingAddress to) public payable returns (uint64) {
        // Whatever is sent to the contract is delegated.
        require(msg.value < type(uint128).max);

        uint128 amount = uint128(msg.value);

        uint64 receiptId = lastReceiptId++;

        Subcall.consensusDelegate(to, amount, receiptId);

        pendingDelegations[receiptId] = PendingDelegation(
            msg.sender,
            to,
            amount
        );

        EnumerableSet.add(pendingDelegationsByUser[msg.sender], uint256(receiptId));

        emit OnDelegateStart(msg.sender, to, msg.value, receiptId);

        return receiptId;
    }

    /**
     * Retrieve the number of pending delegations for a user
     * @param user Who made the delegations
     */
    function GetPendingDelegationCount(address user)
        external view
        returns (uint256)
    {
        return EnumerableSet.length(pendingDelegationsByUser[user]);
    }

    /**
     * Retrieve the pending delegations for a user
     *
     * @param user Who to retrieve pending delegations for
     * @return receiptIds Receipt IDs for the delegation
     * @return pendings Pending delegations
     */
    function GetPendingDelegations(address user)
        external view
        returns (
            uint64[] memory receiptIds,
            PendingDelegation[] memory pendings
        )
    {
        uint256[] memory values = EnumerableSet.values(pendingDelegationsByUser[user]);

        receiptIds = new uint64[](values.length);

        pendings = new PendingDelegation[](values.length);

        for( uint i = 0; i < values.length; i++ )
        {
            uint64 receiptId = uint64(values[i]);

            pendings[i] = pendingDelegations[receiptId];

            receiptIds[i] = receiptId;
        }
    }

    /**
     * Retrieve the number of shares received in return for delegation.
     *
     * The receipt will only be available after the delegate transaction has
     * been included in a block. It is necessary to wait for the message to
     * reach the consensus layer and be processed to determine the number of
     * shares.
     *
     * @param receiptId Receipt ID previously emitted/returned by `delegate`.
     */
    function DelegateDone(uint64 receiptId) public returns (uint128 shares) {
        PendingDelegation memory pending = pendingDelegations[receiptId];

        if (pending.from == address(0)) revert UnknownReceipt();

        shares = Subcall.consensusTakeReceiptDelegate(receiptId);

        Delegation storage d = delegations[pending.from][pending.to];

        d.shares += shares;

        d.amount += pending.amount;

        EnumerableSet.remove(pendingDelegationsByUser[pending.from], receiptId);

        EnumerableSet.add(delegatesByUser[pending.from], StakingAddress.unwrap(pending.to));

        emit OnDelegateDone(receiptId, pending.from, shares);

        // Remove pending delegation.
        delete pendingDelegations[receiptId];
    }

    /**
     * Begin undelegation of a number of shares
     *
     * @param from Validator which the shares were staked with
     * @param shares Number of shares to debond
     */
    function Undelegate(StakingAddress from, uint128 shares)
        public
        returns (uint64)
    {
        if (shares == 0) revert CannotUndelegateZeroShares();

        Delegation storage d = delegations[msg.sender][from];

        if (d.shares < shares) revert NotEnoughShares();

        uint64 receiptId = lastReceiptId++;

        Subcall.consensusUndelegate(from, shares, receiptId);

        uint undelegateAmount =
            ABDKMathQuad.toUInt(
                ABDKMathQuad.div(
                    ABDKMathQuad.fromUInt(d.amount),
                    ABDKMathQuad.div(
                        ABDKMathQuad.fromUInt(d.shares),
                        ABDKMathQuad.fromUInt(shares)
                    )
                )
            );
        // d.amount / (d.shares/shares) ?

        d.shares -= shares;

        d.amount -= undelegateAmount;

        // If no more shares for that delegate, remove it from the per-user set
        if( d.shares == 0 )
        {
            EnumerableSet.remove(delegatesByUser[msg.sender], StakingAddress.unwrap(from));
        }

        EnumerableSet.add(undelegationsByUser[msg.sender], receiptId);

        pendingUndelegations[receiptId] = PendingUndelegation({
            from: from,
            to: payable(msg.sender),
            shares: shares,
            endReceiptId: 0,
            costBasis: undelegateAmount,
            epoch: 0
        });

        return receiptId;
    }

    /**
     * Number of delegates a user is currently staking to
     * @param in_who User to query delegations of
     */
    function GetDelegationsCount(address in_who)
        external view
        returns (uint)
    {
        return EnumerableSet.length(delegatesByUser[in_who]);
    }

    error PaginationError(uint offset, uint pageSize, uint count);

    /**
     * Retrieve all a users delegation details
     * @param in_who Which users delegations to query
     * @return out_delegates Staking addresses of the delegates
     * @return out_delegations Details of the delegations (shares, amount)
     */
    function GetDelegations(address in_who, uint in_offset, uint in_pageSize)
        external view
        returns (
            StakingAddress[] memory out_delegates,
            Delegation[] memory out_delegations
        )
    {
        uint count = EnumerableSet.length(delegatesByUser[in_who]);

        if( (in_offset + in_pageSize) >= count )
        {
            revert PaginationError(in_offset, in_pageSize, count);
        }

        out_delegates = new StakingAddress[](in_pageSize);

        out_delegations = new Delegation[](in_pageSize);

        for( uint i = 0; i < in_pageSize; i++ )
        {
            uint j = in_offset + i;

            bytes32 value = EnumerableSet.at(delegatesByUser[in_who], j);

            StakingAddress delegateAddr = StakingAddress.wrap(bytes21(value));

            out_delegates[j] = delegateAddr;

            out_delegations[j] = delegations[in_who][delegateAddr];
        }
    }

    /**
     * Process the undelegation step, which returns the end receipt ID and
     * the epoch which debonding will finish.
     *
     * If multiple undelegations to the same validator are processed within
     * the same epoch they will have the same `endReceiptId` as they will finish
     * unbonding on the same epoch.
     *
     * @param receiptId Receipt retuned/emitted from `undelegate`
     */
    function UndelegateStart(uint64 receiptId) public {
        PendingUndelegation storage pending = pendingUndelegations[receiptId];

        if (pending.to == address(0)) revert UnknownReceipt();

        (uint64 epoch, uint64 endReceipt) = Subcall
            .consensusTakeReceiptUndelegateStart(receiptId);

        pending.endReceiptId = endReceipt;

        pending.epoch = epoch;

        undelegationPools[endReceipt].totalShares += pending.shares;

        emit OnUndelegateStart(receiptId, pending.to, epoch, pending.shares);
    }

    /**
     * Finish the undelegation process, transferring the staked ROSE back.
     *
     * @param receiptId returned/emitted from `undelegateStart`
     */
    function UndelegateDone(uint64 receiptId) public {
        PendingUndelegation memory pending = pendingUndelegations[receiptId];

        if (pending.to == address(0)) revert UnknownReceipt();

        if (pending.endReceiptId == 0) revert MustUndelegateStartFirst();

        UndelegationPool memory pool = undelegationPools[pending.endReceiptId];

        if (pool.totalAmount == 0) {
            // Did not fetch the end receipt yet, do it now.
            uint128 amount = Subcall.consensusTakeReceiptUndelegateDone(
                pending.endReceiptId
            );

            undelegationPools[pending.endReceiptId].totalAmount = amount;

            pool.totalAmount = amount;
        }

        // Compute how much we get from the pool and transfer the amount.
        uint256 transferAmount = (uint256(pending.shares) *
            uint256(pool.totalAmount)) / uint256(pool.totalShares);

        pending.to.transfer(transferAmount);

        delete pendingUndelegations[receiptId];

        EnumerableSet.remove(undelegationsByUser[pending.to], receiptId);
    }

    /**
     * Retrieve the number of pending delegations for a user
     * @param user Who made the delegations
     */
    function GetUndelegationCount(address user)
        external view
        returns (uint256)
    {
        return EnumerableSet.length(undelegationsByUser[user]);
    }

    /**
     * Retrieve the pending delegations for a user
     *
     * @param user Who to retrieve pending delegations for
     * @return receiptIds Receipt IDs for the delegation
     * @return undelegations Pending delegations
     */
    function GetUndelegations(address user)
        external view
        returns (
            uint64[] memory receiptIds,
            PendingUndelegation[] memory undelegations
        )
    {
        uint256[] memory values = EnumerableSet.values(undelegationsByUser[user]);

        receiptIds = new uint64[](values.length);

        undelegations = new PendingUndelegation[](values.length);

        for( uint i = 0; i < values.length; i++ )
        {
            uint64 receiptId = uint64(values[i]);

            undelegations[i] = pendingUndelegations[receiptId];

            receiptIds[i] = receiptId;
        }
    }
}
