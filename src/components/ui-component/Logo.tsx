import React from "react";
import { useTheme } from "@mui/material/styles";
import { ThemeMode } from "types/config";
import { useTenant } from "components/tenantLayout";

const Logo: React.FC = () => {
  const theme = useTheme();
  const { tenant } = useTenant();
  const tenantLogo = tenant?.Organisation?.branding?.logo;

  const logoStyle = {
    width: "120px",
    height: "auto",
    filter: theme.palette.mode === ThemeMode.DARK ? "invert(1)" : "none",
  };

  if (tenantLogo) {
    return <img src={tenantLogo} alt="logo" style={logoStyle} />;
  }

  return (
    <svg
      width="120"
      viewBox="0 0 695 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M65.0443 137.209C53.6709 135.412 43.6387 130.752 34.6982 123.419C22.05 112.709 14.6541 99.2042 12.4682 83.0165C11.5811 76.4477 11.8349 69.7939 13.1686 63.2283C14.831 55.0445 17.961 47.4823 22.5613 40.4983C23.0674 39.7298 23.4067 38.743 23.4896 37.8276C23.9268 32.9975 24.268 28.1586 24.6146 23.3208C24.6816 22.386 24.6243 21.4424 24.6243 20.2491C24.1169 20.6301 23.8475 20.793 23.6252 21.0048C9.19762 34.7507 1.30386 51.5688 0.13705 71.3579C-0.714329 85.7971 2.38712 99.5134 9.82939 111.973C24.3299 136.249 45.9626 148.939 74.3693 149.961C82.159 150.242 89.8092 148.976 97.2928 146.676C105.622 144.115 113.269 140.289 120.197 135.052C120.754 134.631 121.24 133.781 121.296 133.093C121.874 126.004 122.362 118.908 122.865 111.813C123.463 103.373 124.091 94.936 124.624 86.4926C124.891 82.2493 125.141 77.9926 125.087 73.746C125.049 70.8435 123.565 68.4829 120.939 67.0246C115.311 63.9 107.81 65.6477 104.124 70.8971C103.84 71.3016 103.514 71.6771 102.991 72.3414C101.205 67.3714 97.5579 65.8125 92.9515 65.6588C88.3782 65.5062 84.6138 66.9569 81.9334 70.905C81.9334 70.905 81.9334 68.6308 81.9334 66.6443C81.9334 64.6578 79.5723 63.1819 75.3809 63.2995C71.6293 63.4048 70.0064 67.2115 70.0064 67.6508C70.0064 68.09 69.6621 72.7946 69.6621 72.7946C69.1359 79.4018 68.62 86.01 68.1391 92.6206L68.1267 92.7909C67.9742 94.8841 67.821 96.9889 67.8874 99.0812C68.0004 102.64 69.862 104.506 73.4356 104.82C74.6758 104.929 75.9331 104.831 77.178 104.904C78.5169 104.983 79.1209 104.499 79.2331 103.088C79.677 97.5038 80.1253 91.9164 80.7729 86.3534C81.1465 83.144 81.8975 79.9698 83.8403 77.2501C85.14 75.4308 87.0942 74.6968 88.9228 75.2565C90.4408 75.721 91.2796 77.0592 91.2238 79.4575C91.1611 82.1488 90.9059 84.8362 90.7167 87.5242C90.4409 91.4453 90.022 95.3615 89.9029 99.287C89.8004 102.669 91.4204 104.359 94.8122 104.752C96.2612 104.92 97.7417 104.8 99.2009 104.907C100.631 105.011 101.169 104.273 101.254 103.012C101.395 100.915 101.452 98.8092 101.667 96.7194C102.136 92.1708 102.531 87.6062 103.255 83.0953C103.661 80.5571 104.589 78.0678 106.659 76.2616C107.983 75.1065 109.53 74.7428 111.21 75.3312C112.864 75.9106 113.135 77.4278 113.337 78.8649C113.469 79.8128 113.36 80.8036 113.285 81.7694C112.471 92.2443 111.621 102.716 110.829 113.193C110.517 117.332 110.299 121.478 110.094 125.624C110.018 127.147 109.452 128.181 108.061 128.992C94.6915 136.792 80.3947 139.635 65.0443 137.209Z"
        fill={
          theme.palette.mode === ThemeMode.DARK
            ? theme.palette.common.white
            : theme.palette.grey[900]
        }
      />
      <path
        d="M70.1707 58.2885C70.2069 59.5789 70.1093 66.3625 70.0064 67.6508C71.7262 64.4864 73.0841 63.3243 75.3809 63.2995C79.8865 63.1731 82.2947 65.2233 81.9334 66.6443C81.572 68.0653 82.1051 55.6452 82.1051 55.6452C82.3725 49.9795 80.1838 46.547 75.2095 45.4458C70.3684 44.374 65.6502 44.6169 62.077 48.7926C61.3588 49.6319 60.7583 50.5707 59.865 51.7888C58.2137 46.74 54.5262 45.1761 49.8715 44.9905C45.195 44.804 41.3969 46.2983 38.6604 50.8429C38.5856 49.8564 38.5075 49.4493 38.5312 49.048C39.0422 40.386 39.5424 31.7232 40.1326 23.0665C40.1734 22.4684 40.7757 21.718 41.3284 21.3731C49.6384 16.1875 58.6757 13.0698 68.4587 12.1372C78.0571 11.2222 87.4335 12.2594 96.4745 15.6095C108.259 19.9761 118 27.1483 125.501 37.2063C134.936 49.858 138.958 64.1308 137.787 79.7725C136.988 90.4484 133.443 100.278 127.522 109.248C127.208 109.723 126.934 110.31 126.891 110.864C126.455 116.452 126.067 122.043 125.68 127.634C125.648 128.087 125.718 128.546 125.758 129.332C126.367 128.841 126.751 128.58 127.077 128.262C137.611 118.006 144.695 105.769 148.032 91.5019C150.778 79.7642 150.651 68.0002 147.649 56.2818C144.565 44.2395 138.956 33.4962 130.396 24.4691C111.875 4.93614 89.138 -2.96448 62.3666 0.990608C51.1779 2.64359 41.0593 7.018 31.7217 13.3213C29.7606 14.6451 28.8693 16.0357 28.7355 18.4986C28.0399 31.3045 27.113 44.0983 26.2218 56.8933C25.7725 63.3437 25.1455 69.7826 24.7525 76.236C24.4296 81.5372 25.8401 84.1441 32.024 84.255C36.2789 84.3314 35.8666 84.4374 36.2621 80.5287C36.8419 74.7978 37.3638 69.0582 38.1096 63.3481C38.4804 60.51 39.3763 57.7548 41.5476 55.6568C42.8177 54.4296 44.3487 54.0143 46.0383 54.6626C47.5731 55.2515 48.0322 56.6156 48.0663 58.062C48.1094 59.8897 48.0076 61.7253 47.8809 63.5515C47.523 68.7105 47.0148 73.8617 46.778 79.0255C46.6512 81.7909 48.399 83.6332 51.13 84.0086C52.629 84.2146 54.1609 84.2757 55.6758 84.2537C57.7131 84.224 58.0161 83.8958 58.1607 81.899C58.4683 77.6522 58.5977 73.3859 59.0922 69.1613C59.4656 65.9711 60.0778 62.7693 61.0051 59.6982C61.4893 58.0945 62.709 56.5948 63.9157 55.3547C65.0725 54.1659 66.7833 54.0369 68.3237 54.7511C69.7698 55.4215 70.1301 56.8415 70.1707 58.2885Z"
        fill={theme.palette.primary.main}
      />
      <path
        d="M247.822 67.4381L230.846 92.9306C228.429 96.3296 225.876 98.0291 223.188 98.0291C220.564 98.0291 218.686 96.2352 217.554 92.6474L209.71 67.4381L202.331 107.565H188.987L201.349 40.3405H214.501L226.661 79.1458L252.997 40.3405H266.149L253.787 107.565H240.443L247.822 67.4381ZM308.475 83.4889H276.507C275.604 88.3986 275.712 91.9865 276.831 94.2525C278.015 96.5185 280.974 97.6515 285.71 97.6515C288.782 97.6515 291.228 96.7073 293.047 94.819C294.878 92.8677 295.956 91.0108 296.28 89.2484H307.512C306.273 95.9834 303.509 100.925 299.218 104.072C294.991 107.219 289.838 108.793 283.758 108.793C277.742 108.793 273.226 107.943 270.21 106.243C263.999 102.781 262.265 93.5915 265.008 78.6737C266.64 69.7985 269.785 63.3152 274.441 59.2238C279.109 55.0695 285.443 52.9923 293.443 52.9923C307.331 52.9923 312.88 60.5771 310.091 75.7468C309.79 77.3833 309.251 79.964 308.475 83.4889ZM278.34 75.0858H298.884C299.648 70.9315 299.404 67.9102 298.151 66.0218C296.898 64.1335 294.608 63.1893 291.28 63.1893C288.016 63.1893 285.212 64.165 282.87 66.1163C280.602 68.0046 279.093 70.9945 278.34 75.0858ZM350.681 53.8421L345.002 65.9274C344.112 65.5498 343.058 65.3609 341.842 65.3609C338.642 65.3609 334.457 66.7142 329.288 69.4208L322.273 107.565H309.793L319.707 53.6532H329.019L331.031 58.3741L345.269 52.9923C345.92 52.9294 346.79 52.8979 347.878 52.8979C348.966 52.8979 349.9 53.2126 350.681 53.8421ZM383.007 107.565H374.655L372.013 101.05L357.367 108.132C349.943 108.132 345.437 105.488 343.85 100.201C343.044 97.62 342.658 94.8504 342.69 91.892C342.797 88.8707 343.146 85.7549 343.736 82.5448C344.338 79.2717 344.81 76.8798 345.152 75.3691C345.505 73.7955 345.995 72.0016 346.622 69.9873C347.26 67.9102 347.93 66.1792 348.633 64.7944C349.399 63.4096 350.364 61.9934 351.526 60.5457C352.7 59.035 354.008 57.839 355.45 56.9578C358.689 55.0065 362.612 54.0309 367.22 54.0309H380.372L392.991 53.2756L383.007 107.565ZM373.687 90.3814L378.341 65.0777H368.837C365.317 65.0777 362.61 66.3995 360.715 69.0432C358.885 71.6868 357.484 75.6523 356.512 80.9397C355.551 86.1641 355.514 89.8463 356.4 91.9865C357.351 94.1266 359.65 95.1966 363.298 95.1966L373.687 90.3814ZM451.556 67.4381L434.58 92.9306C432.163 96.3296 429.61 98.0291 426.922 98.0291C424.298 98.0291 422.42 96.2352 421.288 92.6474L413.444 67.4381L406.065 107.565H392.721L405.083 40.3405H418.235L430.395 79.1458L456.731 40.3405H469.883L457.521 107.565H444.177L451.556 67.4381ZM504.421 107.565H496.069L493.427 101.05L478.781 108.132C471.357 108.132 466.851 105.488 465.263 100.201C464.458 97.62 464.071 94.8504 464.103 91.892C464.211 88.8707 464.56 85.7549 465.15 82.5448C465.752 79.2717 466.224 76.8798 466.566 75.3691C466.919 73.7955 467.409 72.0016 468.035 69.9873C468.673 67.9102 469.344 66.1792 470.046 64.7944C470.813 63.4096 471.778 61.9934 472.94 60.5457C474.114 59.035 475.421 57.839 476.864 56.9578C480.102 55.0065 484.026 54.0309 488.634 54.0309H501.786L514.405 53.2756L504.421 107.565ZM495.101 90.3814L499.754 65.0777H490.25C486.73 65.0777 484.023 66.3995 482.129 69.0432C480.299 71.6868 478.898 75.6523 477.925 80.9397C476.965 86.1641 476.927 89.8463 477.814 91.9865C478.764 94.1266 481.064 95.1966 484.712 95.1966L495.101 90.3814ZM554.51 92.6474L554.249 94.0636C552.997 98.7845 550.295 102.341 546.143 104.733C542.055 107.125 537.259 108.321 531.755 108.321C523.627 108.321 518.198 106.873 515.466 103.977C512.944 101.334 512.158 97.4312 513.107 92.2697L513.315 91.1367H524.643C524.111 94.0322 524.514 96.0149 525.854 97.085C527.193 98.155 529.75 98.6901 533.526 98.6901C538.646 98.6901 541.542 96.8647 542.213 93.2139C542.769 90.1925 542.243 88.1783 540.637 87.1712C539.897 86.6676 538.911 86.29 537.677 86.0382L528.276 84.4331C520.071 83.1113 516.802 77.9184 518.469 68.8543C519.395 63.8188 521.969 59.9162 526.19 57.1467C530.487 54.3141 535.515 52.8979 541.275 52.8979C554.395 52.8979 559.931 58.4685 557.882 69.6097L557.656 70.8371H546.808C547.224 67.8787 546.795 65.8645 545.52 64.7944C544.244 63.7244 542.263 63.1893 539.575 63.1893C536.951 63.1893 534.868 63.7244 533.328 64.7944C531.798 65.8015 530.918 66.9345 530.687 68.1934C530.027 71.7813 531.123 73.827 533.974 74.3305L545.208 76.4077C553.122 77.9184 556.223 83.3316 554.51 92.6474ZM581.812 107.565H574.036C569.3 107.565 565.939 106.18 563.952 103.411C562.029 100.641 561.421 97.3367 562.127 93.4971L567.336 65.1721H562.056L563.775 55.8248H569.055L571 45.2501H583.48L581.535 55.8248H590.367L588.648 65.1721H579.816L574.746 92.7418C574.202 95.7002 575.37 97.1794 578.25 97.1794H583.722L581.812 107.565ZM633.814 83.4889H601.846C600.943 88.3986 601.051 91.9865 602.17 94.2525C603.354 96.5185 606.313 97.6515 611.049 97.6515C614.121 97.6515 616.567 96.7073 618.386 94.819C620.217 92.8677 621.294 91.0108 621.618 89.2484H632.85C631.612 95.9834 628.847 100.925 624.557 104.072C620.33 107.219 615.176 108.793 609.096 108.793C603.08 108.793 598.565 107.943 595.549 106.243C589.338 102.781 587.604 93.5915 590.347 78.6737C591.979 69.7985 595.123 63.3152 599.78 59.2238C604.448 55.0695 610.782 52.9923 618.782 52.9923C632.67 52.9923 638.219 60.5771 635.429 75.7468C635.128 77.3833 634.59 79.964 633.814 83.4889ZM603.679 75.0858H624.223C624.987 70.9315 624.742 67.9102 623.49 66.0218C622.237 64.1335 619.947 63.1893 616.619 63.1893C613.355 63.1893 610.551 64.165 608.208 66.1163C605.941 68.0046 604.431 70.9945 603.679 75.0858ZM676.019 53.8421L670.341 65.9274C669.45 65.5498 668.397 65.3609 667.181 65.3609C663.981 65.3609 659.796 66.7142 654.626 69.4208L647.612 107.565H635.132L645.046 53.6532H654.358L656.37 58.3741L670.608 52.9923C671.259 52.9294 672.129 52.8979 673.217 52.8979C674.305 52.8979 675.239 53.2126 676.019 53.8421Z"
        fill={theme.palette.primary.main}
      />
    </svg>
  );
};

export default Logo;