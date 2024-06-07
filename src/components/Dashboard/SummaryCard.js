import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { capitalizeEachWord, formatNumber } from "../Common/Utilities";

const SummaryCard = ({ summary }) => (
  <Row className="mb-4">
    {Object.keys(summary).map((key) => (
      <React.Fragment key={key}>
        <Col>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title className="h6">{summary[key].count}</Card.Title>
              <Card.Text># {`${capitalizeEachWord(key)} Units`}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title className="h6">
                ${formatNumber(summary[key].totalMsrp)}
              </Card.Title>
              <Card.Text>{`${capitalizeEachWord(key)} MSRP`}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title className="h6">
                ${formatNumber(summary[key].avgMsrp)}
              </Card.Title>
              <Card.Text>{`${capitalizeEachWord(key)} Avg MSRP`}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </React.Fragment>
    ))}
  </Row>
);

export default SummaryCard;
