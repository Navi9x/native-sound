package controller;

import com.google.gson.Gson;
import entity.Professionals;
import entity.Skills;
import entity.User;
import java.io.File;
import java.io.IOException;
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
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SaveSkill", urlPatterns = {"/SaveSkill"})
public class SaveSkill extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Response_DTO response_DTO = new Response_DTO();

        String skillText = req.getParameter("skillId");
        String userText = req.getParameter("user_id");
        String about = req.getParameter("about");
        Part coverPic = req.getPart("image");

        Session session = HibernateUtil.getSessionFactory().openSession();

        if (skillText.isEmpty() || skillText.equals("") || !Validations.isInteger(skillText)) {
            response_DTO.setMessage("Please select skill");
        } else if (about.isEmpty() || about.equals("")) {
            response_DTO.setMessage("About is required");
        } else {
            int skillId = Integer.parseInt(skillText);
            int userId = Integer.parseInt(userText);
            User user = (User) session.get(User.class, userId);
            Skills skills = (Skills) session.get(Skills.class, skillId);

            if (coverPic != null) {
                String imagePath = req.getServletContext().getRealPath("") + File.separator + "cover-images" + File.separator + userId + ".png";
                File filePath = new File(imagePath);
                Files.copy(coverPic.getInputStream(), filePath.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }

            Criteria criteria1 = session.createCriteria(Professionals.class);
            criteria1.add(Restrictions.eq("user", user));

            if (criteria1.list().isEmpty()) {
                
                System.out.println(skills.getName());
                System.out.println(user.getFirstName());
                Professionals professionals = new Professionals();
                professionals.setUser(user);
                professionals.setSkills(skills);
                professionals.setAbout(about);
                session.save(professionals);
                session.beginTransaction().commit();
                response_DTO.setSuccess(true);
            }else{
                Professionals professionals = (Professionals) criteria1.uniqueResult();
                professionals.setAbout(about);
                professionals.setSkills(skills);
                session.update(professionals);
                session.beginTransaction().commit();
                response_DTO.setSuccess(true);
            }
            session.close();

        }
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(response_DTO));
    }

}
