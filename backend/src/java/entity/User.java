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
import javax.persistence.Temporal;

@Entity
@Table(name = "user")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "first_name", length = 45, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 45, nullable = false)
    private String lastName;

    @Column(name = "mobile", length = 10, nullable = false)
    private String mobile;

    @Column(name = "password", length = 20, nullable = false)
    private String password;

    @Column(name = "registered_date_time", nullable = false)
    private Date registered_date_time;

    @ManyToOne
    @JoinColumn(name = "user_status_id", nullable = false)
    private User_Status user_status;

    @ManyToOne
    @JoinColumn(name = "languages_id", nullable = false)
    private Languages languages;

    public User() {
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
     * @return the firstName
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * @param firstName the firstName to set
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * @return the lastName
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * @param lastName the lastName to set
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * @return the mobile
     */
    public String getMobile() {
        return mobile;
    }

    /**
     * @param mobile the mobile to set
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the registered_date_time
     */
    public Date getRegistered_date_time() {
        return registered_date_time;
    }

    /**
     * @param registered_date_time the registered_date_time to set
     */
    public void setRegistered_date_time(Date registered_date_time) {
        this.registered_date_time = registered_date_time;
    }

    /**
     * @return the user_status
     */
    public User_Status getUser_status() {
        return user_status;
    }

    /**
     * @param user_status the user_status to set
     */
    public void setUser_status(User_Status user_status) {
        this.user_status = user_status;
    }

    public void setLanguages(Languages languages) {
        this.languages = languages;
    }

    

    public Languages getLanguages() {
        return languages;
    }
    

}
