
import organisation from "./organisations";
import Elements from "./elements";
// import accounting from "./accounting";
import createPapers from "./create-papers";
import CreateCourseBundles from "./createcoursebundles";
import salesPackages from "./sales-packages";
// import CreateOrganization from "./organisation-content";
import manageContent from "./manage-content";
// import generateContent from "./generate-content";
// import instructors from "./instructors";
import CourseManagement from "./coursemanagement";
import AdminPages from "./admin-pages";
import Users from "./users";
import { NavItemType } from "types";
import Learning from "./learning";

const menuItems: { items: NavItemType[] } = {
  items: [
    Elements,
    Learning,
    organisation,
    CourseManagement,
    createPapers,
    CreateCourseBundles,
    salesPackages,
    Users,
    manageContent,
    // accounting,
    AdminPages,
    // CreateOrganization,
    // generateContent,
    // instructors,
  ],
};
export default menuItems;
