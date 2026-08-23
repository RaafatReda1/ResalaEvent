import RegistrationInputs from "./RegistrationInputs";
import BranchSelector from "./BranchSelector";
import ImageUploadDropzone from "./ImageUploadDropzone";
import SubmitButtons from "./SubmitButtons";

const RegistrationForm = ({
  isEditing,
  form,
  file,
  filePreview,
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
      {/* 1. Primary Text Inputs */}
      <RegistrationInputs form={form} onChange={onChange} />

      {/* 2. Bus Pickup Branch Selector */}
      <BranchSelector
        selectedPlace={form.place}
        onSelectBranch={onSelectBranch}
      />

      {/* 3. Personal Photo Upload */}
      <ImageUploadDropzone
        file={file}
        filePreview={filePreview}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
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
