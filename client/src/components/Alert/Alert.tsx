import styles from "./Alert.module.css";


export default function Alert({message, deleteMessage} : {message : string, deleteMessage : () => void}){
    
    return <div className={styles.container} onClick={() => deleteMessage()}>
        {message}
    </div>
}