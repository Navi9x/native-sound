package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.Response_DTO;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Navindu
 */
@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        System.out.println("OKK");

        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(req.getReader(), JsonObject.class);
        Response_DTO response_DTO = new Response_DTO();
        response_DTO.setMessage("hello");

        String mobile = jsonObject.get("mobile").getAsString();
        String password = jsonObject.get("password").getAsString();
        
        if (mobile.isEmpty()) {
            response_DTO.setMessage("Please fill mobile number !");
        } else if (password.isEmpty()) {
            response_DTO.setMessage("Please enter your password !");
        } else {
            
            Session session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("mobile", mobile));
            criteria.add(Restrictions.eq("password", password));
            
            if(!criteria.list().isEmpty()){
                User user = (User) criteria.uniqueResult();
                response_DTO.setObject(user);
                response_DTO.setSuccess(true);
            }else{
                response_DTO.setMessage("Invalid login details !");
            }
            
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(response_DTO));
    }

}
