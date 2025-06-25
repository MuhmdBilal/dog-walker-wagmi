import React from "react";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import classes from "./Staking.module.scss";
import Image from "next/image";
import StakingBackgroundImage from "@/assets/img/StakingBackground.svg";
import StakingWykresImage from "@/assets/img/StakingWykres.svg";
import PreSaleArrow from "@/assets/img/PresaleArrow.svg";
import StakingRectangleBig from "@/assets/img/StakingRectangleBig.svg";
import StakingRectangleSmall from "@/assets/img/StakingRectangleSmall.svg";
import StakingDogLockImage from "@/assets/img/StakingDogLockImage.svg";
import StakingCircleLines from "@/assets/img/StakingCircleLines.svg";
import Ellipse from "@/assets/img/Ellipse 5.svg";
import Ellipse2 from "@/assets/img/Ellipse 6.svg";
import DogWalkerLogo from "@/assets/img/DogLogoWhite.svg";
import StakingClaimRewardsButton from "@/assets/img/StakingClaimRewardsButton.svg";
import {
  useAllowance,
  useDwtApproval,
  useDwtBalanceOf,
} from "@/utils/useDwtContact";
import {
  useClaimReward,
  useGetAccruedReward,
  useGetRewardRates,
  useGetStakeData,
  useGetUserPoolInfo,
  useHasMinimumPurchased,
  useIsLockPeriodOver,
  useRewardsRemaining,
  useStaking,
  useUnStaking,
} from "@/utils/useStakingContract";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import Link from "next/link";
const Staking = () => {
  const { t } = useTranslation("staking");
  const [isMobile, setIsMobile] = useState(false);
  const { dwtBalanceOf, dwtBalanceOfToWei, dwtTokenRefetch } =
    useDwtBalanceOf();
  const { pctOfPool, pctOfPoolRefetch } = useGetUserPoolInfo();
  const { dwtAllowance, dwtRefetch } = useAllowance();
  const { totalStaked, totalStakedRefetch } = useGetStakeData();
  const { isConnected } = useAccount();
  const { buyStaking, isStakingPending, txStakingSuccess } = useStaking();
  const { approveDwt, approvalDwtConfirmed, isDwtApproving } = useDwtApproval({
    amountToSpend: dwtBalanceOfToWei,
  });
  const { hasgetRewardRatesRefetch, getRewardRates } = useGetRewardRates();
  const { rewardsRemaining, rewardsRemainingRefetch } = useRewardsRemaining();
  const { getAccruedReward, getAccruedRewardRefetch } = useGetAccruedReward();
  const { isLockPeriodOver, isLockPeriodOverRefetch } = useIsLockPeriodOver();
  const { hasMinimumPurchased } = useHasMinimumPurchased();
  const { buyUnStaking, isUnStakingPending, txUnStakingSuccess } =
    useUnStaking();
  const {
    buyClaimReward,
    isClaimRewardPending,
    isClaimRewardSuccess,
    txClaimRewardLoading,
    txClaimRewardSuccess,
  } = useClaimReward();
  const handleStaking = async () => {
    if (!isConnected) {
      toast.error("Please connect MetaMask first");
      return;
    }
    if (totalStaked > 0) {
      toast.error(
        "You have already staked an amount. Additional staking is not allowed."
      );
      return;
    }

    if (dwtAllowance < dwtBalanceOf) {
      approveDwt();
      dwtRefetch();
    } else {
      buyStaking({
        value: dwtBalanceOfToWei,
      });
    }
  };
  const handlestakingSeperate = () => {
    buyStaking({
      value: dwtBalanceOfToWei,
    });
  };

  const handleUnstake = () => {
    if (!isConnected) {
      toast.error("Please connect MetaMask first");
      return;
    }
    if (totalStaked <= 0) {
      toast.error("Unable to unstake: staked token amount is 0.");
      return;
    }
    buyUnStaking();
  };
  const handleClaim = async () => {
    if (!isConnected) {
      toast.error("Please connect MetaMask first");
      return;
    }
    if (!isLockPeriodOver) {
      toast.error(
        "Staking is still in progress. Please wait until the period ends."
      );
      return;
    }
    buyClaimReward();
  };
  useEffect(() => {
    if (approvalDwtConfirmed) {
      handlestakingSeperate();
    }
  }, [approvalDwtConfirmed]);
  useEffect(() => {
    if (txStakingSuccess) {
      toast.success("Token staked successfully!");
      pctOfPoolRefetch();
      dwtRefetch();
      totalStakedRefetch();
      dwtTokenRefetch();
      hasgetRewardRatesRefetch();
      rewardsRemainingRefetch();
      getAccruedRewardRefetch();
    }
  }, [txStakingSuccess]);
  useEffect(() => {
    if (txUnStakingSuccess) {
      toast.success("Token unstaked successfully!");
      pctOfPoolRefetch();
      dwtRefetch();
      totalStakedRefetch();
      dwtTokenRefetch();
      hasgetRewardRatesRefetch();
      getAccruedRewardRefetch();
      rewardsRemainingRefetch();
    }
  }, [txUnStakingSuccess]);
  useEffect(() => {
    if (txClaimRewardSuccess) {
      toast.success("Stake reward claimed successfully!");
      pctOfPoolRefetch();
      dwtRefetch();
      totalStakedRefetch();
      dwtTokenRefetch();
      hasgetRewardRatesRefetch();
      getAccruedRewardRefetch();
      rewardsRemainingRefetch();
    }
  }, [txClaimRewardSuccess]);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div className={classes.background}>
      <div className={classes.circleWrapper}>
        <Image src={StakingCircleLines} alt="Dekoracyjne okręgi" priority />
      </div>

      <div className={classes.bgWrapper}>
        <Image
          src={StakingBackgroundImage}
          alt=""
          fill
          className={classes.bg}
          priority
        />
      </div>

      <section className={classes.staking} id="staking">
        <div className={classes.header}>
          <h2 className={classes.heading}>{t("heading")}</h2>
          <button className={classes.howItWorks}>
            {t("howItWorks")}
            <span className={classes.arrow}>
              <Image src={PreSaleArrow} alt="" width={7} />
            </span>
          </button>
        </div>

        <Image
          src={StakingRectangleSmall}
          alt="Mały dekoracyjny prostokąt w tle sekcji staking"
          className={classes.rectangle}
        />

        <Image
          src={StakingRectangleBig}
          alt="Duży dekoracyjny prostokąt w tle sekcji staking"
          className={classes.rectangleSecond}
        />

        <Image
          src={Ellipse}
          alt="Dekoracyjna elipsa"
          className={classes.ellipse}
        />

        <Image
          src={Ellipse2}
          alt="Druga dekoracyjna elipsa"
          className={classes.ellipseTwo}
        />

        <div className={classes.staking__box}>
          <div className={classes.staking_boxOne}>
            <div className={classes.card}>
              <span className={classes.label}>{t("balanceLabel")}</span>
              <span className={classes.value}>
                {Number(dwtBalanceOf).toFixed(2)} DWT
              </span>

              <span className={classes.label}>{t("stakeableLabel")}</span>
              <span className={classes.value}>
                {Number(dwtBalanceOf).toFixed(2)} DWT
              </span>
              {hasMinimumPurchased ? (
                <button
                  className={classes.cta}
                  onClick={handleStaking}
                  disabled={isDwtApproving || isStakingPending}
                >
                  {isDwtApproving || isStakingPending ? "Loading..." : "Stake"}
                </button>
              ) : (
                <button className={classes.cta}>
                  <Link
                    href="#pre-sale"
                    style={{ display: "flex", gap: "8px" }}
                  >
                    {t("purchaseBalanceCTA")}
                    <Image src={PreSaleArrow} alt="" width={7} />
                  </Link>
                </button>
              )}
            </div>
          </div>
          <div className={classes.staking_boxTwo}>
            <div className={classes.card}>
              <span className={classes.label}>{t("percentOfPoolLabel")}</span>
              <span className={classes.value}>
                {Number(pctOfPool * 100).toFixed(2)} % DWT
              </span>

              <span className={classes.label}>{t("totalStakedLabel")}</span>
              <span className={classes.value}>
                {Number(totalStaked).toFixed(2) || "0.00"} DWT
              </span>

              <button
                className={classes.cta}
                onClick={handleUnstake}
                disabled={isUnStakingPending}
              >
                {isUnStakingPending ? "Loading..." : t("withdrawTokensCTA")}
                {/* <Image src={PreSaleArrow} alt="" width={7} /> */}
              </button>
            </div>
          </div>
          <div className={classes.staking_boxThree}>
            {" "}
            <div className={classes.card}>
              <span className={classes.label}>
                {t("estimatedRewardsLabel")}
              </span>
              <span className={classes.value}>
                {getRewardRates || "0.00"}% P/a
              </span>

              <ul className={classes.notes}>
                <li>{t("rewardsRateDynamic")}</li>
                <li>
                  {t("monthlyNote")} 1.25% &nbsp;{t("reward")}{" "}
                </li>
                <li>
                  {t("dailyNote")} 0.041% &nbsp;{t("reward")}
                </li>
              </ul>
            </div>
          </div>
          <div className={classes.staking_boxFour}>
            {" "}
            <div className={classes.card}>
              <span className={classes.label}>{t("currentRewardsLabel")}</span>
              <span className={classes.value}>
                {Number(rewardsRemaining).toFixed(2)}{" "}
              </span>
              <div className={classes.logoWrapper}>
                <Image src={DogWalkerLogo} alt="DogWalker" width={160} />
              </div>
            </div>
          </div>
          <div className={classes.staking_boxFive}>
            <div className={classes.card}>
              <span className={classes.label}>{t("totalRewardsLabel")}</span>
              <span className={classes.value}>
                {Number(getAccruedReward).toFixed(2)} DWT
              </span>

              <button
                className={classes.ctaClaim}
                onClick={handleClaim}
                disabled={isClaimRewardPending}
              >
                {isClaimRewardPending ? (
                  "Loading..."
                ) : (
                  <>
                    <Image
                      src={StakingClaimRewardsButton}
                      alt="Reward button"
                      width={30}
                    />
                    {t("claimRewardsCTA")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={classes.staking__supplyFlex}>
          <div className={classes.staking__supply}>
            <div className={classes.staking__supplyLabel}>
              {t("totalSupplyLabel")}
            </div>
            <div className={classes.staking__supplyInside}>
              <Image src={StakingWykresImage} alt="wykres" />
            </div>
          </div>

          <div className={classes.staking__dogLock}>
            <Image
              src={StakingDogLockImage}
              alt="Ikona psa z kłódką symbolizująca staking"
              width={isMobile ? 200 : undefined}
              height={isMobile ? 200 : undefined}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Staking;
