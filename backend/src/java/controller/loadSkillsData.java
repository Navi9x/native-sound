package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Industry;
import entity.Skills;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Navindu
 */
@WebServlet(name = "loadSkillsData", urlPatterns = {"/loadSkillsData"})
public class loadSkillsData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        System.out.println("ok");

        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        if (req.getParameter("id") == null) {
            Criteria criteria = session.createCriteria(Industry.class);

            List<Industry> industryList = criteria.list();

            ArrayList<JsonObject> industryArray = new ArrayList<>();

            for (Industry industry : industryList) {
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("label", industry.getName());
                jsonObject.addProperty("value", String.valueOf(industry.getId()));
                industryArray.add(jsonObject);
            }

            resp.setContentType("application/json");
            resp.getWriter().write(gson.toJson(industryArray));
        } else {

            int industryId = Integer.parseInt(req.getParameter("id"));
            Industry industry = (Industry) session.get(Industry.class, industryId);

            Criteria criteria = session.createCriteria(Skills.class);
            criteria.add(Restrictions.eq("industry", industry));

            List<Skills> skillList = criteria.list();

            ArrayList<JsonObject> skillsArray = new ArrayList<>();

            for (Skills skill : skillList) {
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("label", skill.getName());
                jsonObject.addProperty("value", String.valueOf(skill.getId()));
                skillsArray.add(jsonObject);
            }

            resp.setContentType("application/json");
            resp.getWriter().write(gson.toJson(skillsArray));

        }

    }

}
