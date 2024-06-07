import React from "react";
import { Offcanvas, Form, Button } from "react-bootstrap";

const Filters = ({
  show,
  onHide,
  makes,
  selectedMakes,
  handleMakeChange,
  duration,
  durationOptions,
  setDuration,
  handleFilterApply,
  handleFilterReset,
}) => (
  <Offcanvas show={show} onHide={onHide} placement="end">
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Filter Data By</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <hr />
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Make</Form.Label>
          {makes.map((make) => (
            <Form.Check
              key={make}
              type="checkbox"
              label={make}
              checked={selectedMakes.includes(make)}
              onChange={() => handleMakeChange(make)}
            />
          ))}
        </Form.Group>
        <hr />
        <Form.Group className="mb-3">
          <Form.Label>Duration</Form.Label>
          {durationOptions.map((option) => (
            <div key={option.id}>
              <Form.Check
                inline
                type="radio"
                id={option.id}
                label={option.label}
                name="duration"
                checked={duration === option.value}
                onChange={(e) => setDuration(option.value)}
              />
            </div>
          ))}
        </Form.Group>
        <Button variant="primary" onClick={handleFilterApply}>
          Apply Filter
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={handleFilterReset}
        >
          Reset Filter
        </Button>
      </Form>
    </Offcanvas.Body>
  </Offcanvas>
);

export default Filters;
