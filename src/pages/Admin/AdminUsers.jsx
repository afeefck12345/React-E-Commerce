import { useState, useEffect } from "react";
import API from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteUser, setDeleteUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage,setCurrentPage]=useState(1)
  const itemsperpage=10

  useEffect(()=>{
    setCurrentPage(1)
  },[search,filterRole])

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
  try {
    const res = await API.get("/orders");
    setOrders(res.data);
  } catch (err) {
    console.error("Failed to fetch orders", err);
  }
};

  const handleRoleChange = async (user, newRole) => {
    try {
      const res = await API.patch(`/users/${user.id}`, { role: newRole });
      setUsers(users.map((u) => (u.id === res.data.id ? res.data : u)));
    } catch (err) {
       console.error("Failed to update role", err.response?.data || err.message);
    
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async () => {
    try{
      const res=await API.patch(`/users/${deleteUser.id}`,{
        active:false
      })
      setUsers(users.map((u)=>(u.id===res.data.id?res.data:u)))
      setDeleteUser(null)
    }catch(err){
      console.error("failed to soft delete user",err)
    }
  };

  const handleBlock=async(user)=>{
    try{
      const res=await API.patch(`/users/${user.id}`,{
        blocked:!user.blocked
      })
      setUsers(users.map((u)=>(u.id===res.data.id?res.data:u)))
    }catch(err){
      console.error("failed to block or unblock",err)
    }
  }

  const filtered = users.filter((u) => {
    if(u.active===false) return false
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const totalPages=Math.ceil(filtered.length/itemsperpage)
  console.log("filtered:", filtered.length, "totalPages:", totalPages)
  const paginated=filtered.slice(
    (currentPage-1)* itemsperpage,
    currentPage* itemsperpage
  )


 return (
  <div className="mt-10">

    
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Admin
        </p>
        <h2 className="text-3xl font-extrabold text-[#0c2340] tracking-tight">
          Users
        </h2>
      </div>
      <p className="text-xs text-sky-900/40 uppercase tracking-widest font-semibold">
        {users.length} total users
      </p>
    </div>

    
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border border-sky-100 bg-white text-sm text-[#0c2340] px-4 py-2.5 rounded-xl outline-none focus:border-sky-400 transition placeholder-sky-900/20"
      />
      <select
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
        className="border border-sky-100 bg-white text-sm text-[#0c2340] px-4 py-2.5 rounded-xl outline-none focus:border-sky-400 transition cursor-pointer"
      >
        <option value="all">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    
    {loading ? (
      <div className="flex flex-col items-center justify-center mt-24 gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-900/40">
          Loading users...
        </p>
      </div>
    ) : (

      <>
      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm shadow-sky-100/40">
         <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr
              className="border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Name</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Email</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Role</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-sky-900/40 text-sm">
                  No users found.
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-sky-100 hover:bg-sky-50/50 transition"
                >
                  
                  <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0c2340]">{user.name}</span>
                          {user.blocked && (
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-red-400">
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                  <td className="px-5 py-3 text-sky-900/50">{user.email}</td>

                 
                  <td className="px-5 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className={`border text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1.5 rounded-full outline-none transition cursor-pointer
                        ${user.role === "admin"
                          ? "border-sky-200 bg-sky-50 text-sky-600 focus:border-sky-400"
                          : "border-sky-100 bg-white text-sky-900/50 focus:border-sky-300"
                        }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button 
                        onClick={()=>setViewUser(user)}
                        className="border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition cursor-pointer"
                        >
                         View 
                        </button>
                        <button
                          onClick={() => handleBlock(user)}
                          className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-lg border transition cursor-pointer ${
                            user.blocked
                              ? "border-green-100 text-green-500 hover:bg-green-50"
                              : "border-orange-100 text-orange-400 hover:bg-orange-50"
                            }`}
                        >
                          {user.blocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => setDeleteUser(user)}
                          className="border border-red-100 text-red-400 hover:bg-red-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition cursor-pointer"
                          >
                          Delete
                        </button>
                      </div>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

    
     {totalPages > 1 && (
  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-1 gap-3">
    <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-900/40">
      Page {currentPage} of {totalPages} · {filtered.length} users
    </p>
    <div className="flex gap-2">  
      <button
        onClick={() => setCurrentPage((p) => p - 1)}
        disabled={currentPage === 1}
        className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
        ← Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border transition cursor-pointer ${
            currentPage === page
              ? "text-white border-none"
              : "border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500"
          }`}
          style={currentPage === page ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" } : {}}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
        Next →
      </button>
    </div>
  </div>
)}
        </>

        )}
    
{viewUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
    <div className="bg-white border border-sky-100 rounded-2xl shadow-xl shadow-sky-100/50 p-5 sm:p-8 w-full max-w-sm max-h-[90vh] overflow-y-auto">

      
      <div
        className="flex items-center justify-between mb-6 pb-4 border-b border-sky-100 -mx-8 -mt-8 px-8 pt-6 rounded-t-2xl"
        style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
      >
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
            Details
          </p>
          <h3 className="text-lg font-extrabold text-[#0c2340] tracking-tight">
            User Info
          </h3>
        </div>
        <button
          onClick={() => setViewUser(null)}
          className="text-sky-900/30 hover:text-sky-900/60 text-xl font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>

      
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
        >
          {viewUser.name?.charAt(0).toUpperCase()}
        </div>
        {viewUser.blocked && (
          <span className="text-[9px] font-semibold uppercase tracking-widest text-red-400 mt-1">
            Blocked
          </span>
        )}
      
      </div>

      
      <div className="flex flex-col gap-3">
        {[
          { label: "Name", value: viewUser.name },
          { label: "Email", value: viewUser.email },
          { label: "Role", value: viewUser.role },
          { label: "Status", value: viewUser.blocked ? "Blocked" : "Active" },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center border-b border-sky-50 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-900/40">
              {item.label}
            </span>
            <span className="text-sm font-bold text-[#0c2340]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
      
<div className="mt-4">
  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-3">
    Orders
  </p>
  {orders.filter((o) => o.userId === viewUser.id).length === 0 ? (
    <p className="text-xs text-sky-900/30 text-center py-3">
      No orders found.
    </p>
  ) : (
    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
      {orders
        .filter((o) => o.userId === viewUser.id)
        .map((order) => (
          <div
            key={order.id}
            className="border border-sky-100 rounded-xl px-3 py-2.5 flex justify-between items-center"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-900/40">
                Order #{order.id}
              </span>
              <span className="text-xs font-bold text-[#0c2340]">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-[#0c2340]">
                ₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </span>
              <span className={`text-[9px] font-semibold uppercase tracking-widest ${
                order.status === "delivered" ? "text-green-500" :
                order.status === "cancelled" ? "text-red-400" :
                "text-orange-400"
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
    </div>
  )}
</div>

      
      <button
        onClick={() => setViewUser(null)}
        className="w-full mt-6 border border-sky-100 text-sky-900/50 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 transition cursor-pointer"
      >
        Close
      </button>
    </div>
  </div>
)}

    
    {deleteUser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
        <div className="bg-white border border-sky-100 rounded-2xl shadow-xl shadow-sky-100/50 p-5 sm:p-8 w-full max-w-sm text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.12))" }}
          >
            👤
          </div>
          <h3 className="text-lg font-extrabold text-[#0c2340] tracking-tight mb-2">
            Deactivate User
          </h3>
          <p className="text-sky-900/40 text-sm mb-6 font-light">
            Are you sure you want to deactivate{" "}
            <span className="text-[#0c2340] font-semibold">{deleteUser.name}</span>?
            They will be hidden from the system.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteUser(null)}
              className="flex-1 border border-sky-100 text-sky-900/50 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition border-none cursor-pointer"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
);
}