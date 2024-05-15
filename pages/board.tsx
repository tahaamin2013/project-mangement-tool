import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import TaskComponent from "../components/TaskComponent";
import BoardSection from "../components/BoardSection";
import { DragDropContext } from "@hello-pangea/dnd";

const AllTasksQuery = gql`
  query {
    tasks {
      id
      title
      description
      status
    }
  }
`;

const GetUserQuery = gql`
  query ($email: String!) {
    user(email: $email) {
      id
      name
      tasks {
        id
        title
        description
        status
      }
    }
  }
`;

const UpdateTaskMutation = gql`
  mutation UpdateTaskMutation(
    $id: String!
    $title: String
    $description: String
    $userId: String
    $status: String
  ) {
    updateTask(
      description: $description
      id: $id
      title: $title
      userId: $userId
      status: $status
    ) {
      id
      title
      description
      status
    }
  }
`;

const Board = () => {
  const { data, loading, error } = useQuery(AllTasksQuery, {
    onCompleted: (data) => {
      console.log("122", data);
    },
  });

  const [updateTask] = useMutation(UpdateTaskMutation);
  const [
    getTasks,
    { data: tasksData, loading: tasksLoading, error: tasksError },
  ] = useLazyQuery(GetUserQuery);
  const [tasks, setTasks] = useState([]);
  const sections: Array<String> = ["Backlog", "In-Progress", "Review", "Done"];

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log(result);
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      return;
    }

    const updatedTasksList =
      tasks &&
      tasks.map((t: any) => {
        if (t.id === draggableId) {
          return {
            ...t,
            status: destination.droppableId,
          };
        } else {
          return t;
        }
      });
    setTasks(updatedTasksList);

    updateTask({
      variables: {
        id: draggableId,
        status: destination.droppableId,
      },
      update: (cache, { data }) => {
        const existingTasks: any = cache.readQuery({
          query: AllTasksQuery,
        });
        const updatedTasks = existingTasks!.tasks.map((t: any) => {
          if (t.id === draggableId) {
            return {
              ...t,
              ...data!.updateTask!,
            };
          } else {
            return t;
          }
        });
        cache.writeQuery({
          query: AllTasksQuery,
          data: { tasks: updatedTasks },
        });
        const dataInCache = cache.readQuery({ query: AllTasksQuery });
        console.log(dataInCache);
      },
      onCompleted: (data) => {
        setTasks(data.tasks);
      },
    });
  };

  let filteredData: Array<Task> = data
    ? data.tasks.filter((task: Task) => {
        return task.status === "Backlog";
      })
    : [];

  console.log("FilteredData", filteredData);

  if (loading) return <p>Loading....</p>;
  if (error) return <p>Error....</p>;
  return (
    <div className="pt-3 h-100 d-flex flex-column">
      <Row>
        <h1>Project Title</h1>
      </Row>
      <DragDropContext onDragEnd={onDragEnd}>
<div className="board-container d-flex flex-row flex-grow-1">
  {sections.map((section, index) => {
    let filteredData = data
      ? data.tasks.filter((task) => {
          return task.status === section;
        })
      : [];
    console.log("section", section);
    // Use a unique identifier (like 'section' itself if it's unique) as the key
    return (
      <BoardSection
        key={String(section)} // Use a unique key for each BoardSection
        title={String(section)}
        tasks={filteredData}
      ></BoardSection>
    );
  })}
</div>

      </DragDropContext>
    </div>
  );
};

export default Board;
