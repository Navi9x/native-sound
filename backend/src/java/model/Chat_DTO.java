package model;

import java.io.Serializable;

public class Chat_DTO implements Serializable{
    
    private String message;
    private String date_time;
    private boolean received;
    private int status;

    
    public Chat_DTO(){
    
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the date_time
     */
    public String getDate_time() {
        return date_time;
    }

    /**
     * @param date_time the date_time to set
     */
    public void setDate_time(String date_time) {
        this.date_time = date_time;
    }

    /**
     * @return the received
     */
    public boolean isReceived() {
        return received;
    }

    /**
     * @param received the received to set
     */
    public void setReceived(boolean received) {
        this.received = received;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
    
}
