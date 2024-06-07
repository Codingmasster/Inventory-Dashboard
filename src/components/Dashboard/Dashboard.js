import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../../redux/InventorySlice";

import AdminHeader from "../Common/Header";
import SummaryCard from "./SummaryCard";
import Filters from "./Filters";
import InventoryTabs from "./InventoryTabs";
import HistoryTable from "./HistoryTable";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.data);

  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState({
    new: { count: 0, totalMsrp: 0, avgMsrp: 0 },
    used: { count: 0, totalMsrp: 0, avgMsrp: 0 },
    cpo: { count: 0, totalMsrp: 0, avgMsrp: 0 },
  });
  const [showFilters, setShowFilters] = useState(false);
  const durationOptions = useMemo(
    () => [
      { id: "lastMonth", label: "Last Month", value: "lastMonth" },
      { id: "thisMonth", label: "This Month", value: "thisMonth" },
      { id: "last3Months", label: "Last 3 Months", value: "last3Months" },
      { id: "last6Months", label: "Last 6 Months", value: "last6Months" },
      { id: "thisYear", label: "This Year", value: "thisYear" },
      { id: "lastYear", label: "Last Year", value: "lastYear" },
    ],
    []
  );
  const [makes, setMakes] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [duration, setDuration] = useState("");

  useEffect(() => {
    dispatch(fetchInventory(filters));
  }, [filters, dispatch]);

  useEffect(() => {
    const brands = [...new Set(inventory.map((item) => item.brand))];
    setMakes(brands);
    setFilteredData(inventory);
    calculateSummary(inventory);
  }, [inventory]);

  const calculateSummary = useCallback((data) => {
    const summary = {
      new: { count: 0, totalMsrp: 0, avgMsrp: 0 },
      used: { count: 0, totalMsrp: 0, avgMsrp: 0 },
      cpo: { count: 0, totalMsrp: 0, avgMsrp: 0 },
    };

    data.forEach((item) => {
      const condition = item.condition.toLowerCase();
      if (summary[condition]) {
        summary[condition].count += 1;
        summary[condition].totalMsrp += item.price;
        summary[condition].avgMsrp =
          summary[condition].totalMsrp / summary[condition].count;
      }
    });

    setSummary(summary);
  }, []);

  const getChartData = useCallback(
    (condition, field = "price") => {
      const filteredItems = filteredData.filter(
        (item) => item.condition.toLowerCase() === condition
      );

      const data = filteredItems.reduce((acc, item) => {
        const date = new Date(item.timestamp).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(parseInt(item[field], 10) || 1);
        return acc;
      }, {});

      const labels = Object.keys(data);
      const datasets = [
        {
          label: `${condition.toUpperCase()} ${
            field === "price" ? "MSRP" : ""
          }`,
          data: labels.map((date) => {
            const values = data[date];
            return field !== "price"
              ? values.length
              : values.reduce((acc, curr) => acc + curr, 0) / values.length;
          }),
          backgroundColor: ["rgba(253, 126, 20, 0.9)"],
          borderWidth: 0,
        },
      ];

      return { labels, datasets };
    },
    [filteredData]
  );

  const handleFilterToggle = useCallback(
    () => setShowFilters((prev) => !prev),
    []
  );

  const handleFilterClose = useCallback(() => setShowFilters(false), []);

  const handleMakeChange = useCallback((make) => {
    setSelectedMakes((prev) =>
      prev.includes(make)
        ? prev.filter((item) => item !== make)
        : [...prev, make]
    );
  }, []);

  const handleFilterApply = useCallback(() => {
    setFilters({ make: selectedMakes.join(","), duration });
    setShowFilters(false);
  }, [selectedMakes, duration]);

  const handleFilterReset = useCallback(() => {
    setDuration("");
    setSelectedMakes([]);
    setFilteredData(inventory);
    calculateSummary(inventory);
    setShowFilters(false);
    setFilters({});
  }, [inventory, calculateSummary]);

  return (
    <Container fluid>
      <AdminHeader />
      <Row>
        <Col md={8}>
          <h3>Inventory</h3>
        </Col>
        <Col md={4} className="text-end">
          <Button onClick={handleFilterToggle} className="mb-3">
            Show Filters
          </Button>
          <Filters
            show={showFilters}
            onHide={handleFilterClose}
            makes={makes}
            selectedMakes={selectedMakes}
            handleMakeChange={handleMakeChange}
            duration={duration}
            durationOptions={durationOptions}
            setDuration={setDuration}
            handleFilterApply={handleFilterApply}
            handleFilterReset={handleFilterReset}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="summary-cards">
          <h4>Recent Gathered Data</h4>
          <SummaryCard summary={summary} />
        </Col>
      </Row>
      <Row>
        <Col className="inventory-tabs mb-4">
          <h4>Inventory Count</h4>
          <InventoryTabs
            getChartData={getChartData}
            field="count"
            options={{
              backgroundColor: "#fff",
              responsive: true,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: { label: (tooltipItem) => `${tooltipItem.raw}` },
                },
              },
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className="inventory-tabs mb-4">
          <h4>Average MSRP in USD</h4>
          <InventoryTabs
            getChartData={getChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: { label: (tooltipItem) => `$${tooltipItem.raw}` },
                },
              },
              chartArea: {
                backgroundColor: "rgba(251, 85, 85, 0.4)",
              },
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>History</h4>
          <HistoryTable data={filteredData} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
