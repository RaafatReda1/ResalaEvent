import { useState } from 'react'
import styles from './Form.module.css'
import uplaodData from './Actions'
import uploadImg from './Actions'
const Form = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        university: "",
        place: "",
    });

    const [file, setFile] = useState(null);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
  return (
    <form>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} />
        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="text" name="university" placeholder="University" onChange={handleChange} />
        <input type="text" name="place" placeholder="Place" onChange={handleChange} />
        <input type="file" name="file" placeholder="Image" onChange={(e) => setFile(e.target.files[0])} />
        <button className={styles.submitButton} onClick={() => uplaodData(form)}>Submit</button>
    </form>
  )
}

export default Form