package controller;

import com.google.gson.Gson;
import entity.Languages;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Response_DTO;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Date currentDateTime = new Date();
        System.out.println(currentDateTime);

        Gson gson = new Gson();
        Response_DTO response_DTO = new Response_DTO();

        String firstName = req.getParameter("firstName");
        String lastName = req.getParameter("lastName");
        String mobile = req.getParameter("mobile");
        String password = req.getParameter("password");
        Part image = req.getPart("image");
        String language = req.getParameter("language");

        if (!Validations.isMobileNumberValid(mobile)) {
            response_DTO.setMessage("Invalid mobile");
        } else if (firstName.equals("") || firstName.isEmpty()) {
            response_DTO.setMessage("Invalid fname");
        } else if (lastName.equals("") || lastName.isEmpty()) {
            response_DTO.setMessage("Invalid lname");
        } else if (language.isEmpty()) {
            response_DTO.setMessage("Invalid language");
        } else if (password.equals("") || password.isEmpty()) {
            response_DTO.setMessage("Invalid password");
        } else if (!Validations.isPassword(password)) {
            response_DTO.setMessage("Weak password");
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();

            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("mobile", mobile));

            if (criteria.list().isEmpty()) {

                User_Status user_Status = (User_Status) session.get(User_Status.class, 2);
                Criteria criteria2 = session.createCriteria(Languages.class);
                criteria2.add(Restrictions.eq("name", language));
                
                User user = new User();
                Languages languages;
                
                if(!criteria2.list().isEmpty()){
                    languages = (Languages) criteria2.uniqueResult();
                    user.setLanguages(languages);
                }else{
                    languages = new Languages();
                    languages.setName(language);
                    session.save(languages);
                    
                    Languages newLanguages = (Languages) criteria2.list().get(0);
                    user.setLanguages(languages);
                }
                
                user.setFirstName(firstName);
                
                user.setLastName(lastName);
                user.setMobile(mobile);
                user.setPassword(password);
                user.setRegistered_date_time(new Date());
                user.setUser_status(user_Status);

                int user_id = (int) session.save(user);
                User logged_user = (User) session.get(User.class, user_id);

                response_DTO.setSuccess(true);
                if(image!=null){
                    response_DTO.setMessage("Image found");
                }else{
                    response_DTO.setMessage("Not image");
                }
                response_DTO.setObject(logged_user);

                if (image != null) {
                    String imagePath = req.getServletContext().getRealPath("") + File.separator + "profile-images" + File.separator + logged_user.getId() + ".png";
                    File file = new File(imagePath);
                    Files.copy(image.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }

            } else {
                response_DTO.setMessage("Mobile repeat");
            }
            session.beginTransaction().commit();
            session.close();

        }
        resp.getWriter().write(gson.toJson(response_DTO));
        resp.setContentType("application/json");
        System.out.println(response_DTO.getMessage());

    }

}
