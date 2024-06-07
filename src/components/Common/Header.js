import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const AdminHeader = () => (
  <Row className="bg-dark text-white py-3 mb-4">
    <Col md={8}>
      <h2>Admin Console</h2>
    </Col>
    <Col md={4} className="text-end">
      <span className="me-2">Welcome, Admin</span>
    </Col>
  </Row>
);

export default AdminHeader;
