import { formatNumber } from "chart.js/helpers";
import React, { useEffect, useState } from "react";
import { Table, Pagination, Form, Row, Col } from "react-bootstrap";

const HistoryTable = ({ data }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("timestamp");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const aggregatedData = data.reduce((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          timestamp: date,
          newInventory: 0,
          newTotalMSRP: 0,
          newAvgMSRP: 0,
          usedInventory: 0,
          usedTotalMSRP: 0,
          usedAvgMSRP: 0,
        };
      }
      const condition = item.condition.toLowerCase();
      if (condition === "new") {
        acc[date].newInventory += 1;
        acc[date].newTotalMSRP += item.price;
      } else if (condition === "used") {
        acc[date].usedInventory += 1;
        acc[date].usedTotalMSRP += item.price;
      }
      return acc;
    }, {});

    const summaries = Object.values(aggregatedData).map((summary) => {
      summary.newAvgMSRP =
        summary.newTotalMSRP > 0
          ? `$${formatNumber(summary.newTotalMSRP / summary.newInventory)}`
          : "$0.00";
      summary.usedAvgMSRP =
        summary.usedTotalMSRP > 0
          ? `$${formatNumber(summary.usedTotalMSRP / summary.usedInventory)}`
          : "$0.00";
      summary.newTotalMSRP = `$${formatNumber(summary.newTotalMSRP)}`;
      summary.usedTotalMSRP = `$${formatNumber(summary.usedTotalMSRP)}`;
      return summary;
    });

    setSortedData(
      summaries.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
          return order === "asc" ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      })
    );
  }, [data, order, orderBy]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalRows = sortedData.length;
  const pageCount = Math.ceil(totalRows / rowsPerPage);

  const renderPaginationItems = () => {
    const items = [];
    const maxPages = 5;
    const current = page + 1;

    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(pageCount, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-start"
          onClick={() => handleChangePage(startPage - 1)}
        />
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i - 1}
          active={i - 1 === page}
          onClick={() => handleChangePage(i - 1)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < pageCount) {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-end"
          onClick={() => handleChangePage(endPage)}
        />
      );
    }

    return items;
  };

  const columns = [
    { id: "timestamp", label: "Date" },
    { id: "newInventory", label: "New Inventory" },
    { id: "newTotalMSRP", label: "New Total MSRP" },
    { id: "newAvgMSRP", label: "New Average MSRP" },
    { id: "usedInventory", label: "Used Inventory" },
    { id: "usedTotalMSRP", label: "Used Total MSRP" },
    { id: "usedAvgMSRP", label: "Used Average MSRP" },
  ];

  return (
    <div className="table-container p-2 mb-5">
      <Table hover>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                onClick={() => handleRequestSort(column.id)}
                style={{ cursor: "pointer" }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <tr key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <td key={column.id}>
                      {typeof value === "object" && value instanceof Date
                        ? value.toLocaleDateString() // Convert Date to string
                        : value}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </Table>
      <Row>
        <Col md={5}></Col>
        <Col md={7} className="align-content-end d-flex">
          <div className="d-flex justify-content-end w-100">
            <span className="me-2 mt-2">Rows per page</span>
            <Form.Select
              className="h-75 me-2 w-auto"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </Form.Select>
          </div>
          <Pagination>
            <Pagination.First
              onClick={() => handleChangePage(0)}
              disabled={page === 0}
            />
            <Pagination.Prev
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() => handleChangePage(page + 1)}
              disabled={page === pageCount - 1}
            />
            <Pagination.Last
              onClick={() => handleChangePage(pageCount - 1)}
              disabled={page === pageCount - 1}
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default HistoryTable;
