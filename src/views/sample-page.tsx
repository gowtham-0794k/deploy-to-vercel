import Typography from "@mui/material/Typography";
import MainCard from "ui-component/cards/MainCard";

const SamplePage = () => (
  <MainCard title="Sample Card">
    <Typography variant="body2">
      MeraMaster seems to be an educational management system developed using
      Next.js and TypeScript, focusing on streamlined course administration. The
      platform offers features for organizing disciplines and divisions, likely
      catering to educational institutions or online learning providers. Its
      user interface, built with Material-UI components, provides a modern and
      responsive design for easy navigation and data management. The system
      appears to support comprehensive CRUD operations, allowing users to
      create, view, update, and delete course-related information efficiently.
    </Typography>
  </MainCard>
);
export default SamplePage;
