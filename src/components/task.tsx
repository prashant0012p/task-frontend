import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  email: string;
  role: "admin" | "user";
}

interface Task {
  _id: string;
  title: string;
}

function Tasks() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in-progress" | "done">("todo");
  const [assignTo, setAssignTo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const userRes = await axios.get("http://localhost:3001/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(userRes.data);

        const taskRes = await axios.get("http://localhost:3001/task", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(taskRes.data);

        if (userRes.data.role === "admin") {
          const usersRes = await axios.get("http://localhost:3001/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error(err);
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading......</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tasks Page</h2>

      {user?.role === "admin" && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Create Task</h3>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const token = localStorage.getItem("token");
              if (!token) return;

              try {
                await axios.post(
                  "http://localhost:3001/task",
                  {
                    name,
                    description,
                    status,
                    assignTo,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                // clear form
                setName("");
                setDescription("");
                setStatus("todo");
                setAssignTo("");

                // re-fetch tasks
                const taskRes = await axios.get("http://localhost:3001/task", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                setTasks(taskRes.data);
              } catch (err) {
                console.error("Task create failed", err);
              }
            }}
          >
            {/* Task Name */}
            <input
              type="text"
              placeholder="Task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <br />

            {/* Description */}
            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <br />

            {/* Status */}
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "todo" | "in-progress" | "done")
              }
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <br />

            {/* Assign To */}
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              required
            >
              <option value="">Assign to user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email}
                </option>
              ))}
            </select>

            <br />

            <button type="submit">Create Task</button>
          </form>
        </div>
      )}

      <div>
        <h3>Task List</h3>

        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>{task.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Tasks;
