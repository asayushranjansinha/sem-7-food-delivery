import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsCartFill } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { logoutRedux } from "../redux/userSlice";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logoutRedux());
    toast.success("Logout successful!");
  };

  const cartItemNumber = useSelector((state) => state.product.cartItem);
  return (
    <header className="fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-white">
      {/* desktop */}

      <div className="flex items-center h-full justify-between">
        <Link to={""}>
          <div className="h-10">
            <img src={logo} className="h-full rounded-xl" />
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-7">
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <Link to={""}>Home</Link>
            <Link to={"about"}>About Us</Link>
            <Link to={"contact"}>Contact Us</Link>
          </nav>
          <div className="text-2xl text-slate-600 relative p-2">
            <Link to={"cart"}>
              <BsCartFill />
              <div className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-md h-4 w-4 flex items-center justify-center text-xs text-white">
                {cartItemNumber.length}
              </div>
            </Link>
          </div>
          <div className=" text-slate-600" onClick={handleShowMenu}>
            <div className="text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md">
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white p-2  shadow drop-shadow-md rounded-lg flex flex-col min-w-[120px] text-center">
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link
                    to={"newproduct"}
                    className="cursor-pointer px-2 hover:bg-red-500 hover:text-white transition rounded-md"
                  >
                    Add product
                  </Link>
                )}

                {userData.firstName ? (
                  <p
                    className="cursor-pointer px-2 hover:bg-red-500 hover:text-white transition rounded-md"
                    onClick={handleLogout}
                  >
                    Logout ({userData.firstName}){" "}
                  </p>
                ) : (
                  <Link
                    to={"login"}
                    className="cursor-pointer px-2 hover:bg-red-500 hover:text-white transition rounded-md"
                  >
                    Login
                  </Link>
                )}
                <nav className="text-base md:text-lg flex flex-col md:hidden font-medium">
                  <Link to={""} className="px-2 py-1 hover:bg-red-500 hover:text-white transition rounded-md">
                    Home
                  </Link>
                  <Link to={"about"} className="px-2 py-1 hover:bg-red-500 hover:text-white transition rounded-md">
                    About
                  </Link>
                  <Link to={"contact"} className="px-2 py-1 hover:bg-red-500 hover:text-white transition rounded-md">
                    Contact
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile */}
    </header>
  );
};

export default Header;
