import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CartServlet", urlPatterns = {"/api/cart"})
public class CartServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String movieId = request.getParameter("id");
        movieId = movieId.split("_")[1];
        PrintWriter out = response.getWriter();
        try {
            if (request.getSession().getAttribute("user") != null) {
                Cart cart = new Cart();
                request.getSession().setAttribute("cart", cart);
            } else {
                System.out.println("the user hasn't been logged in!");
            }
            Cart cart = ((User) request.getSession().getAttribute("user")).getCart();
            Cart.Node dfNode = new Cart.Node(1);
            if(cart.movieQuantity.get(movieId)==null){
                cart.movieQuantity.put(movieId, dfNode );}
            else {
                int qty = cart.movieQuantity.get(movieId).getQuantity();
                cart.movieQuantity.get(movieId).setQuantity(qty+1);
            }
            for (String key: cart.movieQuantity.keySet()) {
                System.out.println(key + ":" + cart.movieQuantity.get(key));
            }
            System.out.println();
            response.setStatus(200);
        } catch (Exception e) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("errorMessage", e.getMessage());
            out.write(jsonObject.toString());
            response.setStatus(500);
        } finally {
            out.close();
        }
    }
}
