import { Bus, MapPin } from "lucide-react";
import { BRANCH_OPTIONS } from "./constants";
import styles from "../Form.module.css";

const BranchSelector = ({ selectedPlace, onSelectBranch }) => {
  return (
    <div className={styles.branchSection}>
      <div className={styles.branchHeader}>
        <div className={styles.branchTitle}>
          <Bus size={20} className="text-yellow-400" />
          <span>
            ايه أقرب فرع لرسالة ليك اللي هيتم نقلك منه من خلال الباص لمكان
            الإيفنت؟ *
          </span>
          <span className={styles.busBadge}>خدمة نقل مجانية</span>
        </div>
        <p className={styles.branchSubtitle}>
          اختر نقطة التجمع الأنسب لك لنقل الحضور ذهاباً وإياباً بأمان وراحة.
        </p>
      </div>

      <div className={styles.branchGrid}>
        {BRANCH_OPTIONS.map((branch) => {
          const isSelected = selectedPlace === branch.name;
          return (
            <div
              key={branch.id}
              onClick={() => onSelectBranch(branch.name)}
              className={`${styles.branchCard} ${
                isSelected ? styles.branchCardActive : ""
              }`}
            >
              <div className={styles.branchIconCircle}>
                <MapPin size={18} />
              </div>
              <span className={styles.branchName}>{branch.name}</span>
              <span className={styles.branchCheckmark}>
                {isSelected ? "✓ تم الاختيار" : branch.area}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BranchSelector;
