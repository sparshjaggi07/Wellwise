import { Outlet } from "react-router-dom";
import DashboardNavbar from "./navigation/patientNavigation";

function PatientDashboardLayout() {
    return (
        <div className="flex">
            <div className="fixed left-0 w-[450px]">
                <DashboardNavbar />
            </div>

            <div className="ml-[160px] z-10">
                <Outlet />
            </div>
        </div>
    );
}

export default PatientDashboardLayout;