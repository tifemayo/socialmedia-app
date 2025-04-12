import "./edit.scss";

const Edit = ({ setOpenEdit }) => {
  return (
    <div className="edit">
      Edit
      <form>
        <input type="file" />
        <input type="file" />
        <input type="text" />
        <input type="text" />
        <input type="text" />

      </form>
      <button onClick={() => setOpenEdit(false)}>X</button>
    </div>
  );
};

export default Edit;
