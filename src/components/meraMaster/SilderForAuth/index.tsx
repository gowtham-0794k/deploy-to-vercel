import { useTenant } from "components/tenantLayout";
import React, { useEffect, useState } from "react";
import { AuthSliderProps } from "types";
import AuthSlider from "ui-component/cards/AuthSlider";
import { Grid } from "utils/genericExports/theme-imports";

export const SliderForAuth = () => {
  const { tenant } = useTenant();
  const [tenantItems, setTenantItems] = useState<AuthSliderProps[]>([]);

  const { slogan1, slogan2, slogan3, subSlogan1, subSlogan2, subSlogan3 } =
    tenant?.Organisation?.branding?.slogans || {
      slogan1: "",
      slogan2: "",
      slogan3: "",
      subSlogan1: "",
      subSlogan2: "",
      subSlogan3: "",
    };

  useEffect(() => {
    if (tenant) {
      const items: AuthSliderProps[] = [
        {
          title: slogan1,
          description: subSlogan1,
        },
        {
          title: slogan2,
          description: subSlogan2,
        },
        {
          title: slogan3,
          description: subSlogan3,
        },
      ];
      setTenantItems(items);
    }
  }, [tenant]);

  return (
    <Grid item xs={12}>
      <Grid item container justifyContent="center" sx={{ pb: 8 }}>
        <Grid item xs={10} lg={8} sx={{ "& .slick-list": { pb: 2 } }}>
          <AuthSlider items={tenantItems} />
        </Grid>
      </Grid>
    </Grid>
  );
};
