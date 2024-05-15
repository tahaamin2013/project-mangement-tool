import React, { useState } from "react";
import { Col, Button, Card, Form, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TaskComponent from "./TaskComponent";
import { Droppable } from "react-beautiful-dnd";
import AddTaskModal from "./AddTaskModal";

interface BoardSectionProps {
  title: string;
  tasks: any;
  reFetchTasks: () => void;
}

const BoardSection: React.FC<BoardSectionProps> = ({
  title,
  tasks,
  reFetchTasks,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    reFetchTasks();
  };
  const handleShow = () => setShowModal(true);

  console.log(title, "title 123")

  return (
    <>
      <Col md={3} className="d-flex flex-column p-2">
        <div className="board-section-header d-flex flex-row align-items-center">
          <h3 className="me-auto">{title}</h3>
          <FontAwesomeIcon
            icon={faPlus}
            style={{ color: "#6f7782" }}
            onClick={handleShow}
          />
        </div>
        <Droppable droppableId={title}>
          {(provided) => (
            <Container
              className="p-0 d-flex flex-column h-100"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <TaskComponent
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </Col>
      <AddTaskModal
        showModal={showModal}
        handleClose={handleClose}
        boardCategory={title}
      />
    </>
  );
};

export default BoardSection;
