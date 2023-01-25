import { React, useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "./supabaseClient";
import axios from "axios";
import DataTable from "react-data-table-component";

const Admin = ({ userData, userId, updateUserData }) => {
  const [toggleCleared, setToggleCleared] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      name: "User ID",
      selector: (row) => row.id,
    },
    {
      name: "Display Name",
      selector: (row) => row.username,
    },
    {
      name: "Website",
      selector: (row) => row.website || "none",
    },
  ];
  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const deleteFromServer = async (deleteId) => {
    const { data, error, status } = await axios.delete("/delete", {
      data: { id: deleteId, adminId: userId },
    });
    if (data === "cannot remove admin") {
      alert("You cannot delete a fellow admin I'm afraid.");
    } else {
      console.log(data);
      // questionable delete method
      updateUserData(deleteId);
    }
  };
  const contextActions = useMemo(() => {
    const handleDelete = () => {
      let selectedUser = selectedRows[0].id;
      if (
        window.confirm(`Are you sure you want to delete:\r ${selectedUser}?`)
      ) {
        setToggleCleared(!toggleCleared);
        // perform delete action here
        // deleteUser(selectedUser);
        deleteFromServer(selectedUser);
      }
    };

    return (
      <button
        key="delete"
        onClick={handleDelete}
        style={{ backgroundColor: "red" }}
      >
        Delete
      </button>
    );
  }, [selectedRows, toggleCleared]);

  return (
    <div>
      <h1>Welcome to the Admin Page!</h1>
      <div style={{ margin: "20px", color: "black" }}>
        <DataTable
          title="Users Table"
          columns={columns}
          data={userData}
          selectableRows
          selectableRowsSingle
          contextActions={contextActions}
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          pagination
          theme="dark"
        />
      </div>
    </div>
  );
};

export default Admin;
