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
  onChange,
  onSelectBranch,
  onFileChange,
  onRemoveFile,
  onSubmit,
  onUpdate,
  onCancelEdit,
}) => {
  return (
    <form
      onSubmit={isEditing ? onUpdate : onSubmit}
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

      {/* 4. Action / Submit Buttons */}
      <SubmitButtons
        loading={loading}
        isEditing={isEditing}
        onCancelEdit={onCancelEdit}
      />
    </form>
  );
};

export default RegistrationForm;

