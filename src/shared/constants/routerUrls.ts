export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const GET_TENENTS = BASE_URL + "/orgUrl";
export const CHECK_MAIL = "/check-mail";
export const SAMPLE_PAGE = "/sample-page";
export const REGISTER = "/register";
export const LOGIN = "/login";
export const SEND_SUPER_ADMIN_INVITE = BASE_URL + "/send-invite";
export const ASSIGN_ROLES = BASE_URL + "/rbac/users/roles/assign";
export const USER_ROLES = BASE_URL + "/rbac/users/roles";
export const DEFAULT_ROLES = BASE_URL + "/rbac/default-roles";
export const USER_ROLES_AND_PERMISSIONS =
  BASE_URL + "/rbac/users/rolesAndPermissions";
export const UPDATE_ROLES_AND_PERMISSIONS =
  BASE_URL + "/rbac/users/updatePermissions";
export const GET_ORGS = BASE_URL + "/org";

export const CREATE_GROUP = BASE_URL + "/createGroup";
export const GET_GROUPS = BASE_URL + "/getGroups";
export const SALES_PACK_BY_GROUP = BASE_URL + "/salesPacksByCourseGroup";
export const DUPLICATE_PACK_NAME = BASE_URL + "/duplicatePackName";
export const GET_PAPERS = BASE_URL + "/papers";
export const ADD_PACKAGES = BASE_URL + "/addPackages";
export const GET_PACKAGES = BASE_URL + "/getPackages";
export const GET_PAPERS_PACK = BASE_URL + "/getPapers";
export const UPDATE_PACKAGE_FEATURES = BASE_URL + "/updatePackages";
export const SALES_PACK = BASE_URL + "/sales-pack";

export const GET_SALES_PACKS = BASE_URL + "/sales-pack";
export const POST_ASSIGN_PACK = BASE_URL + "/assignCourse";
export const GET_ASSIGN_PACK = BASE_URL + "/assignCourse/";
export const GET_COURSES = BASE_URL + "/courses/";
export const POST_ASSIGN_PACKAGES = BASE_URL + "/assignPackage";
export const GET_SALES_PACKAGES = BASE_URL + "/orgPacks/";
export const POST_INVITE_USER_PACKAGES = BASE_URL + "/userSalesPack";

export const UPLOAD_RISE_FILES = BASE_URL + "/uploadRiseFile";
export const GET_RISE_FILES = BASE_URL + "/rise-files";
