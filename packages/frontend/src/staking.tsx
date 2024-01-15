import { ChevronDownIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, CardFooter, Checkbox, Dialog, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";

export enum ValidatorStatus {
    Active,
    Error
}

export interface ValidatorInfo {
    name: string;
    commission: number;
    status: ValidatorStatus;
    address: `oasis${string}`;
    rank: number;
    total: bigint;
    totalPct: number;
}

function ValidatorTable () {
    const TABLE_HEAD = ["Name", "Fee"];

    const TABLE_ROWS: ValidatorInfo[] = [
      {
        name: "John Michael",
        commission: 0.1,
        status: ValidatorStatus.Active,
        address: 'oasis1qq0xmq7r0z9sdv02t5j9zs7en3n6574gtg8v9fyt',
        rank: 177,
        total: 19213209n,
        totalPct: 83
      },
      {
        name: "Alexa Liras",
        commission: 0.15,
        status: ValidatorStatus.Active,
        address: 'oasis1qq0xmq7r0z9sdv02t5j9zs7en3n6574gtg8v9fyt',
        rank: 177,
        total: 19213209n,
        totalPct: 83
      },
    ];

    return (
        <table className="w-full min-w-max table-auto text-left">
            <thead>
                <tr>
                {TABLE_HEAD.map((head) => (
                    <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 hover:bg-blue-gray-100"
                    >
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between font-normal leading-none opacity-70"
                    >
                        {head}
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    </Typography>
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {TABLE_ROWS.map(({ name, commission}, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                    <tr key={name}>
                        <td className={classes}>
                            <Checkbox />
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            >
                            {name}
                            </Typography>
                        </td>
                        <td className={classes} style={{textAlign: 'right'}}>
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            >
                                {commission}
                            </Typography>
                            <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                        </td>
                    </tr>
                );
                })}
            </tbody>
        </table>
    );
}

export function StakeButton () {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    return (
      <>
        <Button onClick={handleOpen}>Stake</Button>
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
                <Typography variant="h5">
                    Validators
                </Typography>
                <Typography variant='paragraph'>
                    Select a validator below to proceed.
                </Typography>

                <ValidatorTable />
            </CardBody>
            <CardFooter className="pt-0">
                <Button variant="text">Cancel</Button>
                <Button variant="gradient" onClick={handleOpen} fullWidth>
                    Select Validator
                </Button>
            </CardFooter>
          </Card>
        </Dialog>
        </>
    );
}