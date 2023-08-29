import React, { useEffect } from 'react';
import { Stack, Table } from '@mui/material';
import blockStyle from '../Block';
import navLinker from "../pageState/observer/navLinker";
import Faqs from './FaqTable';
import data from './faqconfig.json';
import "./FaqBlock.css";
import '../Block.css'

var FaqBlock = React.forwardRef((props, ref) => {
  var id = "faq-block";
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, []);

  return (
    <div style={blockStyle()} className="block" id={id} ref={ref}>
      <div className="faq-block">
        <h1 className="heading faq-heading">FAQs</h1>
        <Stack direction='row' flexWrap="wrap" useFlexGap style={{justifyContent: "center"}}   spacing={{ xs: 3, sm: 5 }}>
            {Object.keys(data).map(header => (
                <div style={{height: "fit-content" }}>
                <h2 className="faq-section-header text-main colored-text" style={{width: "100%"}}>{header}</h2>
                <Table sx={{ minWidth: 300, maxWidth: 400 }} style={{tableLayout: "auto" }}>
                {Object.keys(data[header]).map(question => (
                  <Faqs question={question} answer={data[header][question]}/>
                ))}
                </Table>
                </div>
          ))}
        </Stack>
      </div>
    </div>
  )});

export default FaqBlock;