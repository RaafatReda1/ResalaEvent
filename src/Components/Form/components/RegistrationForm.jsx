import RegistrationInputs from "./RegistrationInputs";
import BranchSelector from "./BranchSelector";
import ImageUploadDropzone from "./ImageUploadDropzone";
import SubmitButtons from "./SubmitButtons";

const RegistrationForm = ({
  isEditing,
  form,
  file,
  filePreview,
  existingImgUrl,
  loading,
  loadingStage,
  onChange,
  onSelectBranch,
  onFileChange,
  onRemoveFile,
  onSubmit,
  onTriggerUpdateConfirm,
  onCancelEdit,
}) => {
  return (
    <form
      onSubmit={isEditing ? onTriggerUpdateConfirm : onSubmit}
      className="w-full flex flex-col gap-6"
    >
      {/* 1. Primary Text Inputs — email locked when editing */}
      <RegistrationInputs form={form} onChange={onChange} isEditing={isEditing} />

      {/* 2. Bus Pickup Branch Selector */}
      <BranchSelector
        selectedPlace={form.place}
        onSelectBranch={onSelectBranch}
      />

      {/* 3. Personal Photo Upload — no-delete when editing existing image */}
      <ImageUploadDropzone
        file={file}
        filePreview={filePreview}
        existingImgUrl={existingImgUrl}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        isEditing={isEditing}
      />

      {/* 4. Action / Submit Buttons with loading stages & confirmation */}
      <SubmitButtons
        loading={loading}
        loadingStage={loadingStage}
        isEditing={isEditing}
        onTriggerUpdateConfirm={onTriggerUpdateConfirm}
        onCancelEdit={onCancelEdit}
      />
    </form>
  );
};

export default RegistrationForm;


