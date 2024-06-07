import React from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

const InventoryTabs = ({ getChartData, options, field = 'price' }) => (
  <Tabs defaultActiveKey="new" id="inventory-tabs" className="mb-3">
    <Tab eventKey="new" title={<Button variant="outline-primary">New</Button>}>
      <Bar data={getChartData("new", field)} options={options} />
    </Tab>
    <Tab eventKey="used" title={<Button variant="outline-primary">Used</Button>}>
      <Bar data={getChartData("used", field)} options={options} />
    </Tab>
    <Tab eventKey="cpo" title={<Button variant="outline-primary">CPO</Button>}>
      <Bar data={getChartData("cpo", field)} options={options} />
    </Tab>
  </Tabs>
);

export default InventoryTabs;
