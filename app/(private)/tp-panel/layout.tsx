"use client";
import { ReactNode, useEffect, useState } from "react";
import { Drawer } from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import MenuContent from "./partials/MenuContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Transition from "@/app/Transition";
import Cookies from "js-cookie";
import CurrentUserContext from "@/lib/providers/CurrentUserContext";

export default function RootLayout({ children }: { children: ReactNode }) {
	const [user, setUser] = useState();
	const [currentUser, setCurrentUser] = useState(null);
	const router = useRouter();
	useEffect(() => {
		const user = JSON.parse(Cookies.get("user") || "{}");
		setCurrentUser(user);
		if (!user?.token) {
			handleLogout();
		} else {
			// decode token expiry
			const tokenExpiry = JSON.parse(atob(user.token.split(".")[1])).exp;
			// check if token is expired
			if (tokenExpiry * 1000 < Date.now()) {
				handleLogout();
			}
		}
	}, [user]);
	const handleLogout = () => {
		toast.success("Signed Out, redirecting...", {
			toastId: "loggedOut",
		});
		Cookies.remove("user", { path: "/" });
		setUser(null as any);
		router.replace("/tp-admin", undefined);
	};
	const [openDrawer, setOpenDrawer] = useState(false);
	const openTheDrawer = () => setOpenDrawer(true);
	const closeTheDrawer = () => setOpenDrawer(false);

	const [openCollapsible, setOpenCollapsible] = useState(null);

	const handleOpenCollapsible = (value: any) => {
		setOpenCollapsible(openCollapsible === value ? null : value);
		if (openCollapsible !== value) {
			setIsMinified(false);
			setMenuWidth("20rem");
		}
	};

	const [isMinified, setIsMinified] = useState(false);

	const [menuWidth, setMenuWidth] = useState("20rem");

	const handleMinify = () => {
		setIsMinified(!isMinified);
		setMenuWidth(isMinified ? "20rem" : "6rem");
		setOpenCollapsible(isMinified ? openCollapsible : null);
	};

	return (
		<html>
			<head />
			<body>
				<Transition>
					<CurrentUserContext.Provider value={currentUser}>
						<header>
							<nav></nav>
						</header>
						<section className='flex flex-row h-full'>
							<section className='hidden sm:block'>
								<div
									className='h-screen p-4 overflow-y-scroll custom-scroll custom-y-scroll bg-gray-100 relative overflow-x-hidden'
									style={{
										transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
										width: menuWidth,
									}}
								>
									<MenuContent
										hasMinifier={true}
										isMinified={isMinified}
										handleMinify={handleMinify}
										openCollapsible={openCollapsible}
										handleOpenCollapsible={handleOpenCollapsible}
										handleLogout={handleLogout}
										closeTheDrawer={closeTheDrawer}
									/>
								</div>
							</section>
							<section
								className={`h-full${
									menuWidth == "20rem" ? " sm:max-w-[calc(100vw-20rem)]" : ""
								}${
									menuWidth == "6rem" ? " sm:max-w-[calc(100vw-6rem)]" : ""
								} w-full `}
							>
								<section className='sm:hidden'>
									<nav className='h-[3rem] flex justify-between p-4 bg-gray-100'>
										<Bars3Icon
											onClick={openTheDrawer}
											className='h-5 w-5 cursor-pointer'
										/>
									</nav>
									<>
										<Drawer
											open={openDrawer}
											onClose={closeTheDrawer}
											className='p-4 overflow-y-scroll custom-scroll custom-y-scroll bg-gray-100 overflow-x-hidden'
										>
											<MenuContent
												hasMinifier={false}
												isMinified={isMinified}
												handleMinify={handleMinify}
												openCollapsible={openCollapsible}
												handleOpenCollapsible={handleOpenCollapsible}
												handleLogout={handleLogout}
												closeTheDrawer={closeTheDrawer}
											/>
										</Drawer>
									</>
								</section>
								<section
									className={`h-[calc(100vh-3rem)] sm:h-screen overflow-y-scroll custom-scroll custom-y-scroll`}
								>
									{children}
								</section>
							</section>
						</section>
						<ToastContainer />
					</CurrentUserContext.Provider>
				</Transition>
			</body>
		</html>
	);
}
