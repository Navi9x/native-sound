package controller;

import com.google.gson.Gson;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
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
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Navindu
 */
@MultipartConfig
@WebServlet(name = "UpdateUser", urlPatterns = {"/UpdateUser"})
public class UpdateUser extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        Response_DTO response_DTO = new Response_DTO();

        String id = req.getParameter("id");
        String firstName = req.getParameter("firstName");
        String lastName = req.getParameter("lastName");
        String mobile = req.getParameter("mobile");
        String password = req.getParameter("password");
        Part image = req.getPart("image");

        if (image != null) {
            String imagePath = req.getServletContext().getRealPath("") + File.separator + "profile-images" + File.separator + id + ".png";
            File file = new File(imagePath);
            Files.copy(image.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
            System.out.println("Success");
        }
        
        if(firstName == null){
        
        }else if (firstName.isEmpty() || firstName.equals("")) {
            response_DTO.setMessage("Invalid first name");
        } else if (lastName.isEmpty() || lastName.equals("")) {
            response_DTO.setMessage("Invalid last name");
        } else if (mobile.isEmpty() || mobile.equals("")) {
            response_DTO.setMessage("Invalid mobile");
        } else if (password.isEmpty() || password.equals("")) {
            response_DTO.setMessage("Invalid password");
        } else if (!Validations.isMobileNumberValid(mobile)) {
            response_DTO.setMessage("Invalid mobile");
        } else if (!Validations.isPassword(password)) {
            response_DTO.setMessage("Weak password");
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();
            User user = (User) session.get(User.class, Integer.parseInt(id));
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.and(Restrictions.eq("mobile", mobile), Restrictions.ne("mobile", user.getMobile())));

            if (criteria.list().isEmpty()) {

                if (!firstName.equals(user.getFirstName()) || !lastName.equals(user.getLastName()) || !password.equals(user.getPassword()) || !mobile.equals(user.getMobile())) {
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setMobile(mobile);
                    user.setPassword(password);
                    session.save(user);
                    try {
                        session.beginTransaction().commit();
                        response_DTO.setSuccess(true);
                        response_DTO.setObject(user);
                    } catch (Exception e) {
                    }
                }else{
                    response_DTO.setMessage("No values to change");
                }

            } else {
                response_DTO.setMessage("Mobile number already registered");
            }
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(response_DTO));

    }

}
