type Paper = {
  paper_id: string;
  features: {
    _id: string;
    name: string;
  }[];
};

type GroupBundle = {
  _id: string;
  packageName: string;
  papers: Paper[];
};

type SalesPackDetails = {
  _id: string;
  nameSalesPack: string;
  FreePack: boolean;
  FreePackDuration: number;
  PackStartDate: string;
  PackEndDate: string | null;
  salepackprice: string;
};

type CourseResponse = {
  _id: string;
  salesPackageId: string;
  salesPackDetails: SalesPackDetails;
  groupBundleDetails: GroupBundle[];
};

export function flattenCourseData(courseData: CourseResponse[]) {
  return courseData.map((course) => {
    // Flatten salesPackDetails
    const {
      _id,
      nameSalesPack,
      FreePack,
      FreePackDuration,
      PackStartDate,
      PackEndDate,
      salepackprice,
    } = course.salesPackDetails;

    // Collect all features into a single array
    const features: string[] = course.groupBundleDetails.flatMap((bundle) =>
      bundle.papers.flatMap((paper) =>
        paper.features.map((feature) => feature.name)
      )
    );

    return {
      _id: course._id,
      salesPackageId: course.salesPackageId,
      salesPackId: _id,
      nameSalesPack,
      FreePack,
      FreePackDuration,
      PackStartDate,
      PackEndDate,
      salepackprice,
      features,
    };
  });
}

export const getMonths = (sortedData: any) => {
  const months = new Set();

  sortedData.forEach((item: any) => {
    const endDate = item.PackEndDate;
    if (endDate) {
      const endMonth = new Date(endDate);
      const monthYear = endMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      months.add(monthYear);
    }
  });

  // Convert Set to array and sort
  const sortedMonths: any = Array.from(months).sort();

  // Filter out months with a gap of 3 months
  const buttonMonths = [];
  for (let i = 0; i < sortedMonths.length; i++) {
    const currentMonth = new Date(sortedMonths[i]);
    if (i === 0) {
      buttonMonths.push(sortedMonths[i]); // Add the first month
    } else {
      const prevMonth = new Date(sortedMonths[i - 1]);
      const monthDiff =
        (currentMonth.getFullYear() - prevMonth.getFullYear()) * 12 +
        currentMonth.getMonth() -
        prevMonth.getMonth();
      if (monthDiff >= 3) {
        buttonMonths.push(sortedMonths[i]);
      }
    }
  }
  return buttonMonths;
};

export const staticFeatures = [
  "Chapter Analysis",
  "Ask Question",
  "Get Question",
  "Quiz",
  "Interactive Learning",
  "Revision Notes",
  "Q and A's",
  "Case Studies",
];
