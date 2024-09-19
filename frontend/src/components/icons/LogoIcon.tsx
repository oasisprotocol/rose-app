import { FC } from 'react'
import { useAppState } from '../../hooks/useAppState'

type LogoSize = 'small' | 'medium' | 'large'

const logoSizeMap: Record<LogoSize, { width: number; height: number }> = {
  large: {
    width: 400,
    height: 75.25,
  },
  medium: {
    width: 320,
    height: 66.49,
  },
  small: {
    width: 180.75,
    height: 34,
  },
}

interface Props {
  className?: string
  size?: LogoSize
}

export const LogoIcon: FC<Props> = ({ className, size }) => {
  const {
    state: { isDesktopScreen },
  } = useAppState()
  const defaultSize = isDesktopScreen ? 'medium' : 'small'
  const logoSize = logoSizeMap[size ?? defaultSize]

  return (
    <svg
      className={className}
      width={logoSize.width}
      height={logoSize.height}
      viewBox="0 0 241 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M153.988 11.3499H117.897C115.306 11.3499 113.206 13.4501 113.206 16.0408V31.077C113.206 33.6676 115.306 35.7678 117.897 35.7678H153.988C156.579 35.7678 158.679 33.6676 158.679 31.077V16.0408C158.679 13.4501 156.579 11.3499 153.988 11.3499Z"
        fill="white"
      />
      <path
        d="M239.479 22.2087C239.968 21.7908 240.345 21.3192 240.607 20.7912C240.868 20.2631 240.999 19.7069 240.999 19.1276C240.999 18.2484 240.778 17.4973 240.34 16.8719C239.902 16.2465 239.302 15.7697 238.543 15.4416C237.785 15.1135 236.928 14.952 235.975 14.952H230.72C230.331 14.952 230.013 15.2698 230.013 15.6595V29.8293C230.013 30.2189 230.331 30.5368 230.72 30.5368H230.779C231.169 30.5368 231.487 30.2189 231.487 29.8293V24.2542C231.487 23.8645 231.804 23.5467 232.194 23.5467H233.501C233.95 23.5467 234.375 23.7543 234.65 24.1106L239.397 30.2599C239.53 30.4342 239.738 30.5342 239.958 30.5342C240.545 30.5342 240.878 29.8575 240.517 29.3935L236.472 24.1619C236.267 23.8979 236.413 23.5057 236.744 23.4467C237.039 23.3955 237.377 23.3134 237.687 23.1878C238.395 22.9494 238.992 22.6239 239.484 22.2061H239.479V22.2087ZM235.303 22.2317H232.266C231.835 22.2317 231.484 21.8806 231.484 21.4499V16.7976C231.484 16.5182 231.71 16.2926 231.989 16.2926H235.972C236.598 16.2926 237.169 16.4079 237.692 16.6386C238.213 16.8693 238.63 17.1923 238.943 17.6101C239.256 18.0279 239.412 18.5329 239.412 19.1276C239.412 19.753 239.233 20.299 238.877 20.7681C238.52 21.2372 238.036 21.5986 237.426 21.8524C236.816 22.1061 236.108 22.2317 235.306 22.2317H235.303Z"
        fill="white"
      />
      <path
        d="M78.5662 15.7306C77.5486 15.0795 76.3618 14.7566 75.0007 14.7566C73.6396 14.7566 72.4477 15.0821 71.4249 15.7306C70.4022 16.3817 69.6076 17.3122 69.0488 18.522C68.4874 19.7319 68.208 21.175 68.208 22.8489C68.208 24.5227 68.4874 25.9427 69.0488 27.1552C69.6101 28.365 70.4022 29.3006 71.4249 29.9594C72.4477 30.6182 73.6422 30.9463 75.0007 30.9463C76.3593 30.9463 77.5486 30.6182 78.5662 29.9594C79.5839 29.3006 80.3759 28.3676 80.9424 27.1552C81.5115 25.9453 81.7934 24.5099 81.7934 22.8489C81.7934 21.1878 81.5089 19.714 80.9424 18.5092C80.3734 17.307 79.5813 16.3791 78.5662 15.728V15.7306ZM77.9716 25.7659C77.6793 26.5733 77.2769 27.1885 76.7617 27.6166C76.2465 28.0421 75.6595 28.2548 75.0007 28.2548C74.3419 28.2548 73.7524 28.0421 73.2295 27.6166C72.7066 27.1911 72.299 26.5733 72.0068 25.7659C71.7146 24.9584 71.5685 23.9869 71.5685 22.8514C71.5685 21.7159 71.7146 20.7444 72.0068 19.937C72.299 19.1295 72.704 18.5143 73.2295 18.0863C73.7524 17.6608 74.3419 17.448 75.0007 17.448C75.6595 17.448 76.2439 17.6608 76.7617 18.0863C77.2769 18.5118 77.6819 19.1244 77.9716 19.9241C78.2638 20.7239 78.4099 21.7005 78.4099 22.8514C78.4099 24.0023 78.2638 24.9584 77.9716 25.7659Z"
        fill="white"
      />
      <path
        d="M100.665 27.2887V24.6228C100.665 24.2384 100.978 23.9256 101.362 23.9256H105.394C105.779 23.9256 106.091 23.6129 106.091 23.2284V21.9314C106.091 21.5469 105.779 21.2342 105.394 21.2342H101.362C100.978 21.2342 100.665 20.9215 100.665 20.537V18.4094C100.665 18.025 100.978 17.7122 101.362 17.7122H108.175C108.56 17.7122 108.873 17.3995 108.873 17.015V15.718C108.873 15.3335 108.56 15.0208 108.175 15.0208H98.0888C97.7043 15.0208 97.3916 15.3335 97.3916 15.718V29.975C97.3916 30.3595 97.7043 30.6722 98.0888 30.6722H108.265C108.65 30.6722 108.962 30.3595 108.962 29.975V28.678C108.962 28.2935 108.65 27.9807 108.265 27.9807H101.362C100.978 27.9807 100.665 27.668 100.665 27.2835V27.2887Z"
        fill="white"
      />
      <path
        d="M93.21 22.6825C92.7102 22.3313 92.1642 22.0545 91.5721 21.852C90.9826 21.6495 90.3879 21.4777 89.7906 21.3368C89.1934 21.1958 88.6423 21.0445 88.1424 20.8882C87.6426 20.7318 87.2427 20.5268 86.9428 20.2704C86.6429 20.0167 86.4942 19.6809 86.4942 19.2605C86.4942 18.6786 86.7147 18.2301 87.1556 17.9148C87.5965 17.5995 88.1527 17.4431 88.8268 17.4431C89.2908 17.4431 89.7188 17.538 90.1162 17.7225C90.5109 17.9096 90.8416 18.1814 91.103 18.5402C91.1338 18.5812 91.162 18.6222 91.1876 18.6658C91.3209 18.8863 91.5516 19.0272 91.8079 19.0272H93.7688C94.2661 19.0272 94.6199 18.53 94.4404 18.066C94.4404 18.066 94.4404 18.0609 94.4379 18.0583C94.302 17.7148 94.1277 17.397 93.9149 17.1048C93.3613 16.3409 92.641 15.759 91.7515 15.3566C90.8621 14.9516 89.8855 14.7517 88.8243 14.7517C87.6734 14.7517 86.6711 14.9542 85.8201 15.3566C84.9691 15.759 84.3078 16.3102 83.8361 17.0048C83.3645 17.6995 83.1286 18.4813 83.1286 19.3476C83.1286 20.214 83.2773 20.8754 83.5772 21.4213C83.8771 21.9673 84.277 22.4056 84.7768 22.7337C85.2767 23.0618 85.8278 23.331 86.425 23.5412C87.0223 23.7514 87.617 23.9308 88.2065 24.0795C88.7961 24.2281 89.342 24.3896 89.8444 24.5614C90.3443 24.7331 90.7442 24.9536 91.0441 25.2227C91.344 25.4918 91.4926 25.8507 91.4926 26.2993C91.4926 26.9119 91.2645 27.3912 90.8082 27.7347C90.352 28.0782 89.7419 28.2499 88.9806 28.2499C88.0399 28.2499 87.3222 27.9731 86.8275 27.4194C86.607 27.1734 86.4378 26.876 86.3174 26.5325C86.2174 26.248 85.9483 26.0558 85.6458 26.0558H83.8207C83.344 26.0558 83.0056 26.512 83.1338 26.9709C83.2542 27.4041 83.4183 27.809 83.6259 28.1807C84.1181 29.0625 84.823 29.7418 85.7329 30.2211C86.6455 30.7004 87.7297 30.9388 88.9832 30.9388C90.1187 30.9388 91.1312 30.7414 92.0207 30.3441C92.9101 29.9494 93.6099 29.4034 94.1174 28.7062C94.625 28.0115 94.8787 27.2016 94.8787 26.2736C94.8787 25.3457 94.7249 24.6408 94.4199 24.0641C94.1123 23.4899 93.7099 23.026 93.21 22.6748V22.6825Z"
        fill="white"
      />
      <path
        d="M64.0878 24.8073C63.8725 24.4612 63.975 24.005 64.3185 23.7845C64.6389 23.5769 64.9029 23.3385 65.2157 23.0642C65.7539 22.5926 66.1641 22.0697 66.4486 21.4955C66.7331 20.9213 66.8741 20.3267 66.8741 19.714C66.8741 18.7272 66.6306 17.8864 66.1461 17.1918C65.6591 16.4971 64.9901 15.9614 64.1391 15.5871C63.2881 15.2129 62.314 15.0258 61.2246 15.0258H55.6264C55.2137 15.0258 54.8779 15.3616 54.8779 15.7743V29.9287C54.8779 30.3414 55.2137 30.6772 55.6264 30.6772H57.3823C57.7949 30.6772 58.1307 30.3414 58.1307 29.9287V25.343C58.1307 24.9329 58.464 24.5997 58.8741 24.5997H60.0173C60.2685 24.5997 60.5018 24.7227 60.6402 24.9329C61.34 25.9864 63.3188 29.2315 63.9802 30.3183C64.116 30.5413 64.357 30.6772 64.6184 30.6772H66.3973C66.9843 30.6772 67.3432 30.0313 67.033 29.534L64.0878 24.8098V24.8073ZM61.2221 17.7147C61.6553 17.7147 62.0449 17.7967 62.3883 17.9607C62.7318 18.1248 63.0061 18.3581 63.206 18.6554C63.4085 18.9553 63.5085 19.3065 63.5085 19.7089C63.5085 20.1421 63.3957 20.524 63.1727 20.8521C62.9497 21.1802 62.6421 21.4391 62.2525 21.6262C61.8629 21.8134 61.4066 21.9056 60.8837 21.9056H58.8741C58.4614 21.9056 58.1256 21.5699 58.1256 21.1572V18.4606C58.1256 18.0479 58.4614 17.7121 58.8741 17.7121H61.2221V17.7147Z"
        fill="white"
      />
      <path
        d="M38.8482 6.81309C36.9436 4.87012 34.6931 3.27576 32.199 2.11459C32.0965 2.06332 31.9939 2.01462 31.8888 1.97104C31.3993 1.75316 30.9045 1.54298 30.397 1.35842C28.977 0.843199 27.4902 0.466396 25.9548 0.240827C24.8808 0.0844663 23.7837 -0.00012207 22.6687 -0.00012207C10.1676 -0.00012207 -0.000976562 10.1684 -0.000976562 22.6696C-0.000976562 32.4075 6.17141 40.7305 14.8097 43.932C15.8247 44.3088 16.8757 44.6138 17.9548 44.842C19.4774 45.1649 21.0513 45.3393 22.6687 45.3393C31.2788 45.3393 38.7841 40.5126 42.6188 33.4251C44.3515 30.2236 45.3384 26.5606 45.3384 22.6696C45.3384 16.5023 42.8597 10.9041 38.8482 6.81309ZM6.76097 34.799C4.08233 31.2668 2.6674 27.0502 2.6674 22.608C2.6674 15.0233 6.87119 8.40489 13.0718 4.95727C13.2358 4.86499 13.3973 5.08287 13.2615 5.21103C12.695 5.7442 12.1516 6.31581 11.6312 6.92075C8.03748 11.1245 5.96635 16.8407 5.94841 22.608C5.94841 30.0954 10.9571 38.1774 19.0494 38.1774C26.2701 38.1774 32.1452 31.1925 32.1452 22.608C32.1452 18.5734 30.7918 14.7003 28.4848 11.8269C28.4028 11.7243 28.5002 11.5808 28.6258 11.6192C32.5297 12.7727 35.4492 17.2636 35.4492 22.608C35.4492 27.3296 33.737 32.0281 30.7507 35.5014C27.6543 39.1028 23.4992 41.0868 19.0519 41.0868C14.3662 41.0868 9.88305 38.7901 6.76097 34.7965V34.799ZM38.9353 10.4299C41.6114 13.9544 43.0238 18.1633 43.0212 22.6029C43.0212 30.1877 38.8174 36.8086 32.6168 40.2537C32.4528 40.346 32.2913 40.1281 32.4271 39.9999C32.9936 39.4668 33.537 38.8952 34.0574 38.2902C37.6511 34.089 39.7222 28.3729 39.7402 22.6029C39.7402 15.1156 34.7315 7.03353 26.6392 7.03353C19.4185 7.03353 13.5434 14.0185 13.5434 22.6029C13.5434 26.6375 14.8968 30.5107 17.2064 33.3841C17.2884 33.4866 17.191 33.6302 17.0654 33.5917C13.1615 32.4382 10.2419 27.9499 10.2419 22.6055C10.2419 17.8865 11.9542 13.188 14.9404 9.71473C18.0369 6.11331 22.1919 4.12933 26.6444 4.12933C31.3249 4.12933 35.8081 6.42347 38.9404 10.4273H38.9353V10.4299ZM29.7767 22.608C29.7767 27.9551 27.1801 32.5715 23.4556 34.6427C22.9942 34.899 22.4252 34.8682 21.9997 34.5555L21.2025 33.9736C17.9369 31.5898 15.9093 27.2322 15.9093 22.6029C15.9093 17.2559 18.5059 12.6394 22.2304 10.5683C22.6918 10.312 23.2608 10.3427 23.6863 10.6555L24.4835 11.2373C27.7491 13.6212 29.7793 17.9762 29.7793 22.608H29.7767Z"
        fill="white"
      />
      <path
        d="M119.718 14.9516H119.712C119.471 14.9516 119.248 15.0849 119.138 15.2951C118.385 16.7203 117.821 18.0942 117.449 19.4168C117.047 20.8446 116.847 22.3108 116.847 23.8154C116.847 25.3201 117.047 26.7478 117.449 28.191C117.821 29.5264 118.385 30.908 119.138 32.3332C119.251 32.546 119.474 32.6767 119.712 32.6767H119.718C120.207 32.6767 120.517 32.1564 120.289 31.7206C119.677 30.5466 119.215 29.3931 118.897 28.255C118.495 26.8119 118.295 25.3303 118.295 23.8129C118.295 22.2954 118.495 20.8138 118.897 19.3707C119.213 18.2352 119.677 17.0791 120.289 15.9051C120.515 15.4694 120.207 14.949 119.718 14.949V14.9516Z"
        fill="#0500E1"
      />
      <path
        d="M133.002 25.0435C133.002 25.9227 132.822 26.6917 132.466 27.3556C132.11 28.0169 131.61 28.5347 130.969 28.9064C130.328 29.278 129.577 29.4652 128.713 29.4652C127.85 29.4652 127.096 29.278 126.447 28.9064C125.799 28.5347 125.297 28.0169 124.94 27.3556C124.584 26.6942 124.405 25.9227 124.405 25.0435V15.6029C124.405 15.2441 124.115 14.9544 123.756 14.9544H123.538C123.179 14.9544 122.89 15.2441 122.89 15.6029V25.0435C122.89 26.1893 123.138 27.1941 123.638 28.0579C124.138 28.9217 124.825 29.5959 125.704 30.0778C126.583 30.5622 127.588 30.8032 128.719 30.8032C129.849 30.8032 130.851 30.5622 131.72 30.0778C132.592 29.5933 133.276 28.9217 133.773 28.0579C134.271 27.1941 134.522 26.1893 134.522 25.0435V15.6029C134.522 15.2441 134.232 14.9544 133.873 14.9544H133.655C133.297 14.9544 133.007 15.2441 133.007 15.6029V25.0435H133.002Z"
        fill="#0500E1"
      />
      <path
        d="M146.825 24.1952L146.868 25.5512C146.891 26.3151 145.884 26.6047 145.497 25.9485L139.361 15.5057C139.158 15.1622 138.789 14.952 138.392 14.952H138.374C137.753 14.952 137.251 15.4544 137.251 16.0747V29.7986C137.251 30.2061 137.582 30.5342 137.987 30.5342C138.394 30.5342 138.722 30.2036 138.722 29.7986V21.2705L138.681 20.0043C138.656 19.243 139.663 18.9482 140.05 19.6044L146.21 29.9831C146.412 30.324 146.779 30.5342 147.176 30.5342C147.796 30.5342 148.299 30.0318 148.299 29.4115V15.6877C148.299 15.2801 147.968 14.952 147.563 14.952C147.156 14.952 146.827 15.2827 146.827 15.6877V24.1952H146.825Z"
        fill="#0500E1"
      />
      <path
        d="M151.746 14.9519C151.254 14.9519 150.946 15.4773 151.177 15.9105C151.797 17.082 152.264 18.2354 152.579 19.371C152.981 20.8141 153.181 22.2957 153.181 23.8131C153.181 25.3306 152.981 26.8122 152.579 28.2553C152.264 29.3909 151.794 30.5443 151.177 31.7158C150.946 32.1515 151.254 32.6744 151.746 32.6744C151.984 32.6744 152.207 32.5437 152.32 32.3335C153.086 30.9058 153.655 29.5241 154.019 28.1861C154.414 26.743 154.611 25.2845 154.611 23.8106C154.611 22.3367 154.414 20.8423 154.019 19.412C153.653 18.0893 153.086 16.7128 152.32 15.2877C152.207 15.0775 151.984 14.9467 151.746 14.9467V14.9519Z"
        fill="#0500E1"
      />
      <path
        d="M171.869 23.0335C171.31 22.7054 170.7 22.4414 170.038 22.2415C169.377 22.0415 168.713 21.8544 168.052 21.6827C167.39 21.5109 166.78 21.3187 166.222 21.1034C165.663 20.8881 165.214 20.6087 164.871 20.2652C164.527 19.9243 164.358 19.4603 164.358 18.881C164.358 18.0172 164.689 17.3251 165.353 16.8047C166.014 16.2844 166.891 16.0229 167.975 16.0229C168.734 16.0229 169.415 16.1614 170.018 16.4356C170.62 16.7099 171.097 17.0944 171.446 17.5865C171.697 17.9403 171.858 18.335 171.927 18.7708C171.979 19.0809 172.25 19.3065 172.566 19.3065H172.758C173.158 19.3065 173.465 18.9476 173.401 18.5503C173.299 17.9249 173.078 17.3661 172.74 16.8714C172.271 16.187 171.628 15.6513 170.81 15.2642C169.992 14.8772 169.046 14.6849 167.975 14.6849C166.903 14.6849 165.999 14.8643 165.217 15.2206C164.435 15.5769 163.827 16.0716 163.397 16.7048C162.966 17.3379 162.748 18.0787 162.748 18.9271C162.748 19.7013 162.92 20.3344 163.261 20.824C163.602 21.3161 164.053 21.7109 164.612 22.0082C165.171 22.3056 165.783 22.5542 166.455 22.7567C167.124 22.9566 167.788 23.1463 168.441 23.3257C169.095 23.5052 169.703 23.7128 170.261 23.9512C170.82 24.1896 171.269 24.5023 171.612 24.8893C171.953 25.2764 172.125 25.7891 172.125 26.4299C172.125 27.3834 171.771 28.1268 171.064 28.6625C170.356 29.1982 169.439 29.4674 168.306 29.4674C167.011 29.4674 165.968 29.0854 165.181 28.3165C164.504 27.6603 164.117 26.7657 164.022 25.6327C163.994 25.2995 163.704 25.0457 163.369 25.0457H163.179C162.805 25.0457 162.5 25.3635 162.53 25.7352C162.605 26.6888 162.843 27.5116 163.24 28.2037C163.733 29.0598 164.417 29.7083 165.294 30.1466C166.173 30.585 167.183 30.8054 168.331 30.8054C169.344 30.8054 170.259 30.6311 171.076 30.2799C171.894 29.9313 172.543 29.4289 173.019 28.7727C173.496 28.1191 173.735 27.3219 173.735 26.3837C173.735 25.5507 173.563 24.8663 173.222 24.3305C172.878 23.7948 172.43 23.3642 171.871 23.0361L171.869 23.0335Z"
        fill="white"
      />
      <path
        d="M175.636 16.2924H179.674C180.032 16.2924 180.322 16.5821 180.322 16.941V29.8855C180.322 30.2444 180.612 30.534 180.971 30.534H181.168C181.527 30.534 181.817 30.2444 181.817 29.8855V16.941C181.817 16.5821 182.106 16.2924 182.465 16.2924H186.502C186.861 16.2924 187.151 16.0028 187.151 15.6439V15.6029C187.151 15.2441 186.861 14.9544 186.502 14.9544H175.634C175.275 14.9544 174.985 15.2441 174.985 15.6029V15.6439C174.985 16.0028 175.275 16.2924 175.634 16.2924H175.636Z"
        fill="white"
      />
      <path
        d="M192.02 15.9028L187.244 29.6753C187.098 30.0982 187.411 30.5366 187.857 30.5366H188.047C188.323 30.5366 188.57 30.3622 188.659 30.1008L189.938 26.4404C190.031 26.179 190.277 26.0047 190.551 26.0047H196.167C196.444 26.0047 196.69 26.1815 196.782 26.443L198.046 30.1008C198.136 30.3622 198.382 30.5391 198.661 30.5391H198.848C199.294 30.5391 199.61 30.0982 199.461 29.6779L194.686 15.9053C194.488 15.3363 193.952 14.9569 193.353 14.9569C192.75 14.9569 192.217 15.3388 192.02 15.9053V15.9028ZM191.474 24.6641C191.025 24.6641 190.712 24.2232 190.861 23.8002L192.438 19.2837L192.753 18.2917C192.945 17.6868 193.801 17.6894 193.991 18.2917L194.288 19.2376L195.867 23.8002C196.013 24.2232 195.701 24.6615 195.252 24.6615H191.471L191.474 24.6641Z"
        fill="white"
      />
      <path
        d="M211.714 14.952H211.55C211.378 14.952 211.211 15.0212 211.088 15.1443L206.031 20.2221L204.962 21.332C204.554 21.7575 203.834 21.4628 203.844 20.8732L203.865 19.4865V15.6031C203.865 15.2442 203.575 14.9546 203.216 14.9546H203.042C202.683 14.9546 202.394 15.2442 202.394 15.6031V29.8883C202.394 30.2471 202.683 30.5368 203.042 30.5368H203.216C203.575 30.5368 203.865 30.2471 203.865 29.8883V24.754C203.865 24.5823 203.932 24.4182 204.052 24.2978L205.439 22.8905C205.718 22.606 206.187 22.6393 206.423 22.9623L211.816 30.2753C211.939 30.442 212.131 30.5394 212.339 30.5394H212.601C213.134 30.5394 213.439 29.9319 213.123 29.5038L207.371 21.7114C207.182 21.4551 207.207 21.0962 207.43 20.8706L212.17 16.0619C212.575 15.6518 212.283 14.9572 211.709 14.9572L211.714 14.952Z"
        fill="white"
      />
      <path
        d="M217.453 28.5473V23.7744C217.453 23.4156 217.743 23.1259 218.102 23.1259H223.544C223.903 23.1259 224.192 22.8363 224.192 22.4774V22.4364C224.192 22.0775 223.903 21.7879 223.544 21.7879H218.102C217.743 21.7879 217.453 21.4982 217.453 21.1394V16.9458C217.453 16.587 217.743 16.2973 218.102 16.2973H226.269C226.627 16.2973 226.917 16.0077 226.917 15.6488V15.6078C226.917 15.2489 226.627 14.9593 226.269 14.9593H216.628C216.269 14.9593 215.979 15.2489 215.979 15.6078V29.893C215.979 30.2518 216.269 30.5415 216.628 30.5415H226.358C226.717 30.5415 227.007 30.2518 227.007 29.893V29.852C227.007 29.4931 226.717 29.2035 226.358 29.2035H218.102C217.743 29.2035 217.453 28.9138 217.453 28.5549V28.5473Z"
        fill="white"
      />
    </svg>
  )
}
