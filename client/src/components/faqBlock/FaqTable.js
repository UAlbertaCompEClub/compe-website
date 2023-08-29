import React from 'react';
import { TableRow, TableCell, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const Faqs = ({ question, answer }) => {
    const [open, setOpen] = React.useState(false);  
      return (
        <>
            <TableRow>
                <TableCell style={{maxWidth: 30, minWidth: 30}} >
                   <IconButton
                    aria-label="expand row"
                    size="small"
                    color="secondary"
                    onClick={() => setOpen(!open)}
                    >
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell width="95%">
                <b className="text-faq faq-question"> {question}</b>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2} align="left">
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <p className="text-faq faq-answer"> {answer} </p>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

export default Faqs;