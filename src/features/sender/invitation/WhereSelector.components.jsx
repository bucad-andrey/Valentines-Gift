import ImageUploader from "../../../shared/ui/ImageUploader";

export default function WhereSelector({ form, updateField }) {
  const { whereImageFiles, whereImagePreviews, selectedWhereIndex } = form;

  return (
    <div className="grid grid-cols-3 gap-4">
      {whereImageFiles.map((_, index) => (
        <div
          key={index}
          onClick={() => updateField("selectedWhereIndex", index)}
          className={`p-1 cursor-pointer ${
            selectedWhereIndex === index ? "ring-4 ring-rose-400" : ""
          }`}
        >
          <ImageUploader
            initialImage={whereImagePreviews[index]}
            onSelect={(file) => {
              const files = [...whereImageFiles];
              files[index] = file;
              updateField("whereImageFiles", files);
            }}
          />
        </div>
      ))}
    </div>
  );
}

