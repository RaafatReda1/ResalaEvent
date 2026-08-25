import { fetchUsers } from "@/utils/adminActions";
import { useEffect } from "react";
import { signOutUser } from "../Form/Actions";
import AdminHeader from "./Components/AdminHeader/AdminHeader";
import AdminAside from "./Components/AdminAside/AdminAside";

const Admin = () => {
  const handleSignOut = async () => {
    await signOutUser();
    console.log("signed out");
  };

  useEffect(() => {
    console.log(fetchUsers());
    handleSignOut();
  }, []);

  return (
    <>
      <AdminHeader />
      <AdminAside />
    </>
  );
};

export default Admin;
