// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { StakingAddress, Subcall } from "@oasisprotocol/sapphire-contracts/contracts/Subcall.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";

abstract contract UsingStaking {
    /**
     * Initializes any state necessary for mock staking
     */
    function _staking_initialize () internal virtual;

    /**
     * Equivalent to Subcall.sol::consensusDelegate
     */
    function _staking_delegate(
        StakingAddress to,
        uint128 amount,
        uint64 receiptId
    )
        internal virtual
        returns (bytes memory data);

    /**
     * Equivalent to Subcall.sol::consensusUndelegate
     */
    function _staking_undelegate(StakingAddress from, uint128 shares, uint64 receiptId)
        internal virtual;

    /**
     * Equivalent to Subcall.sol::consensusTakeReceiptDelegate
     */
    function _staking_takeReceiptDelegate(uint64 receiptId)
        internal virtual
        returns (uint128 shares);

    /**
     * Equivalent to Subcall.sol::consensusTakeReceiptUndelegateStart
     */
    function _staking_takeReceiptUndelegateStart(uint64 receiptId)
        internal virtual
        returns (uint64 epoch, uint64 endReceipt);

    /**
     * Equivalent to Subcall.sol::consensusTakeReceiptUndelegateDone
     */
    function _staking_takeReceiptUndelegateDone(uint64 receiptId)
        internal virtual
        returns (uint128 amount);
}

contract MockVault {
    mapping(address => mapping(StakingAddress => uint256)) private balances;

    event OnMockVaultCreated(address contractAddress);

    uint64 public epoch;

    constructor () {
        emit OnMockVaultCreated(address(this));
    }

    function nextEpoch ()
        public
        returns (uint64)
    {
        epoch += 1;

        return epoch;
    }

    function balance (StakingAddress x)
        external view
        returns (uint256)
    {
        return balances[msg.sender][x];
    }

    function deposit (StakingAddress x)
        external payable
    {
        balances[msg.sender][x] += msg.value;
    }

    function withdraw (StakingAddress x, uint256 amount)
        external
    {
        balances[msg.sender][x] -= amount;

        payable(msg.sender).transfer(amount);
    }
}

abstract contract RealStaking is UsingStaking {
    function _staking_initialize () internal override
    {
        // Does nothing
    }

    function _staking_delegate(
        StakingAddress to,
        uint128 amount,
        uint64 receiptId
    )
        internal override
        returns (bytes memory data)
    {
        return Subcall.consensusDelegate(to, amount, receiptId);
    }

    function _staking_undelegate(StakingAddress from, uint128 shares, uint64 receiptId)
        internal override
    {
        return Subcall.consensusUndelegate(from, shares, receiptId);
    }

    function _staking_takeReceiptDelegate(uint64 receiptId)
        internal override
        returns (uint128 shares)
    {
        return Subcall.consensusTakeReceiptDelegate(receiptId);
    }

    function _staking_takeReceiptUndelegateStart(uint64 receiptId)
        internal override
        returns (uint64 epoch, uint64 endReceipt)
    {
        return Subcall.consensusTakeReceiptUndelegateStart(receiptId);
    }

    function _staking_takeReceiptUndelegateDone(uint64 receiptId)
        internal override
        returns (uint128 amount)
    {
        return Subcall.consensusTakeReceiptUndelegateDone(receiptId);
    }
}

abstract contract MockStaking is UsingStaking {
    // Python: '0x' + sha256(b'MockSubcaller').hexdigest()
    // TODO: use https://eips.ethereum.org/EIPS/eip-7201
    bytes32 private constant STATE_STORAGE_ADDRESS = 0xc55d012a88ac0621771a14f971f5ca71c14c7f4e1632e2a87a08dc0e41206ce9;

    struct MockStaking_UserDelegation {
        uint256 rose;
        uint256 shares;
    }

    struct MockStaking_Validator {
        uint256 totalROSE;
        uint256 totalShares;
        mapping(address => MockStaking_UserDelegation) users;
    }

    struct MockStaking_DelegationReceipt {
        bool exists;
        StakingAddress to;
        uint256 delegateBlockNumber;
        bool delegateReceiptFetched;
        uint256 delegateReceiptFetchedBlockNumber;
        uint128 shares;
        uint256 rose;
        address user;
    }

    struct MockStaking_UndelegationReceipt {
        bool exists;
        StakingAddress from;
        uint blockNumber;
        address user;
        uint128 shares;
        uint64 finishEpoch;
        bool startReceiptTaken;
        bool doneReceiptTaken;
    }

    struct MockStaking_State {
        bool initialized;
        MockVault vault;
        mapping(StakingAddress => MockStaking_Validator) validators;
        mapping(uint64 => MockStaking_DelegationReceipt) delegationReceipts;
        mapping(uint64 => MockStaking_UndelegationReceipt) undelegationReceipts;
    }

    function _getState()
        private pure
        returns (MockStaking_State storage state)
    {
        assembly {
            state.slot := STATE_STORAGE_ADDRESS
        }
    }

    function _staking_initialize ()
        internal override
    {
        MockStaking_State storage state = _getState();

        if( ! state.initialized )
        {
            state.vault = new MockVault();

            state.initialized = true;
        }
    }

    function _staking_delegate(
        StakingAddress to,
        uint128 amount,
        uint64 receiptId
    )
        internal override
        returns (bytes memory)
    {
        _staking_initialize();

        MockStaking_State storage state = _getState();

        // Recepit must not previously exist
        require( false == state.delegationReceipts[receiptId].exists, "duplicate receipt" );

        // User must be depositing the appropriate amount
        require( msg.value >= amount, "not enough funds transferred" );

        require( msg.value <= type(uint128).max, "transferred funds exceed max allowed" );

        // Send funds to our vault
        state.vault.deposit{value: msg.value}(to);

        // And initialize the receipt for storage later
        state.delegationReceipts[receiptId] = MockStaking_DelegationReceipt({
            exists: true,
            to: to,
            delegateBlockNumber: block.number,
            delegateReceiptFetched: false,
            shares: 0,
            delegateReceiptFetchedBlockNumber: 0,
            rose: msg.value,
            user: msg.sender
        });

        // Result is not used.
        return "";
    }

    /**
     * Shares get allocated when the delegation receipt is taken
     * @param receiptId Receipt ID provided to `consensusDelegate`
     */
    function _staking_takeReceiptDelegate(uint64 receiptId)
        internal override
        returns (uint128 shares)
    {
        _staking_initialize();

        MockStaking_State storage state = _getState();

        MockStaking_DelegationReceipt storage receipt = state.delegationReceipts[receiptId];

        require( block.number > receipt.delegateBlockNumber, "receipt not ready yet!" );
        require( receipt.exists, "receipt doesn't exist!");
        require( receipt.delegateReceiptFetched == false, "delegate receipt fetched!" );

        MockStaking_Validator storage validator = state.validators[receipt.to];

        // Initial deposit is 1:1, 1 ROSE = 1 SHARE
        shares = uint128(receipt.rose);

        if( validator.totalShares != 0 )
        {
            // convert from assets to shares with support for rounding direction.
            // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/bd325d56b4c62c9c5c1aff048c37c6bb18ac0290/contracts/token/ERC20/extensions/ERC4626.sol#L199
            shares = uint128(Math.mulDiv(receipt.rose, validator.totalShares + (10**18), validator.totalROSE + 1, Math.Rounding.Up));
        }
        else {
            require( validator.totalROSE == 0, "expected totalROSE == 0" );
        }

        // Update receipt with the necessary info
        receipt.shares = shares;
        receipt.delegateReceiptFetched = true;
        receipt.delegateReceiptFetchedBlockNumber = block.number;

        validator.totalROSE += receipt.rose;
        validator.totalShares += shares;

        MockStaking_UserDelegation storage userDeleg = validator.users[receipt.user];
        userDeleg.rose += receipt.rose;
        userDeleg.shares += shares;
    }

    function _staking_undelegate(StakingAddress from, uint128 shares, uint64 receiptId)
        internal override
    {
        _staking_initialize();

        MockStaking_State storage state = _getState();

        require( state.undelegationReceipts[receiptId].exists == false,
                "duplicate undelegation receipt!" );

        require( shares <= state.validators[from].users[msg.sender].shares,
                "not enough shares" );

        state.undelegationReceipts[receiptId] = MockStaking_UndelegationReceipt({
            exists: true,
            from: from,
            user: msg.sender,
            shares: shares,
            blockNumber: block.number,
            finishEpoch: state.vault.epoch() + 1,
            startReceiptTaken: false,
            doneReceiptTaken: false
        });
    }

    function _staking_takeReceiptUndelegateStart(uint64 receiptId)
        internal override
        returns (uint64 epoch, uint64 endReceipt)
    {
        _staking_initialize();

        MockStaking_State storage state = _getState();

        MockStaking_UndelegationReceipt storage udr = state.undelegationReceipts[receiptId];

        require( udr.exists == true );
        require( udr.startReceiptTaken == false );
        require( block.number > udr.blockNumber );

        udr.startReceiptTaken = true;

        return (udr.finishEpoch, receiptId);
    }

    function _staking_takeReceiptUndelegateDone(uint64 receiptId)
        internal override
        returns (uint128 amount)
    {
        _staking_initialize();

        MockStaking_State storage state = _getState();

        MockStaking_UndelegationReceipt storage udr = state.undelegationReceipts[receiptId];

        require( udr.exists == true );
        require( udr.startReceiptTaken == true );
        require( udr.doneReceiptTaken == false );

        udr.doneReceiptTaken = true;

        MockStaking_Validator storage validator = state.validators[udr.from];

        // convert from shares to assets with support for rounding direction.
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/bd325d56b4c62c9c5c1aff048c37c6bb18ac0290/contracts/token/ERC20/extensions/ERC4626.sol#L206
        amount = uint128(Math.mulDiv(udr.shares, validator.totalROSE + 1, validator.totalShares + (10**18), Math.Rounding.Down));

        validator.users[msg.sender].shares -= udr.shares;

        validator.users[msg.sender].rose -= amount;

        validator.totalROSE -= amount;

        validator.totalShares -= udr.shares;

        state.vault.withdraw(udr.from, amount);
    }
}
