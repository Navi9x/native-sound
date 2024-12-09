package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "chat_type")
public class Chat_Type implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "from_user_id")
    private User from_user;

    @ManyToOne
    @JoinColumn(name = "to_user_id")
    private User to_user;

    @ManyToOne
    @JoinColumn(name = "translate")
    private Type_Status translate;

    @ManyToOne
    @JoinColumn(name = "is_lock")
    private Type_Status is_lock;

    public Chat_Type() {
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the from_user
     */
    public User getFrom_user() {
        return from_user;
    }

    /**
     * @param from_user the from_user to set
     */
    public void setFrom_user(User from_user) {
        this.from_user = from_user;
    }

    /**
     * @return the to_user
     */
    public User getTo_user() {
        return to_user;
    }

    /**
     * @param to_user the to_user to set
     */
    public void setTo_user(User to_user) {
        this.to_user = to_user;
    }

    /**
     * @return the translate
     */
    public Type_Status getTranslate() {
        return translate;
    }

    /**
     * @param translate the translate to set
     */
    public void setTranslate(Type_Status translate) {
        this.translate = translate;
    }

    public Type_Status getIs_lock() {
        return is_lock;
    }

    public void setIs_lock(Type_Status is_lock) {
        this.is_lock = is_lock;
    }
    
    
    
}
