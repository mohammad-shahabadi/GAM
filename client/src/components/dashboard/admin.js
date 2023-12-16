import React from 'react';
import Image from "next/image";
import img1 from "../../assets/images/education_welcome-2810fefecd8eaa59ff9b1c47f7657074cc2fe915cb662a42eabf494667fea8e9.svg"
const AdminDashboard = ({ user, onLogout,texts }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">
                {texts('welcome')}, {user.first_name} {user.last_name}
            </h1>
            <p className="text-lg mb-2"> {user.email}</p>
            <Image width={600} height={400} src={img1.src} alt={"img"}/>
            <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
            >
                {texts('logout')}
            </button>
        </div>
    );
};

export default AdminDashboard;