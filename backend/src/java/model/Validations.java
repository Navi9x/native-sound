package model;

public class Validations {


    public static boolean isPassword(String password) {
        return password.matches("^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$");
    }

    public static boolean isMobileNumberValid(String mobileNumber) {
        return mobileNumber.matches("^\\+(?:[0-9] ?){6,14}[0-9]$");
    }

    public static boolean isInteger(String text) {
        return text.matches("^\\d+$");
    }
}
