import { Route, Switch, BrowserRouter } from "react-router-dom";
import { Dashboard, Contact, Customer, SellManager, GroupUsers } from "../Component/Main";
import {
  ChangePassword,
  LoginComponent,
} from "../Component/Users";
import {
  ProductManager,
  CategoriesManager,
  AttributeManager,
  ProductPromotion,
  Voucher,
} from "../Component/Products";
import { NewsManager } from "../Component/News";
import { CareerManager } from "../Component/Career";
import { CartManager } from "../Component/Cart";
import { Setting, SlideManager, MenuManager, MenuWebsiteManager } from "../Component/Settings";
import { UsersManager } from "../Component/Users/UsersManager";
import { Service } from "../Component/ServiceChange";
import { Language, LanguageDetails } from "../Component/AddLanguage";
import LeftMenu from "../Component/Template/LeftMenu";


export const Routers = () => {
  return (
    <BrowserRouter>
      <Route path="/" component={LeftMenu} />
      <Switch>
        <Route exact path="/" component={LoginComponent} />
        <Route exact path="/home" component={Dashboard} />
        <Route exact path="/doi-mat-khau" component={ChangePassword} />
        <Route exact path="/san-pham" component={ProductManager} />
        <Route exact path="/thuoc-tinh-san-pham" component={AttributeManager} />
        <Route exact path="/danh-muc-san-pham" component={CategoriesManager} />
        <Route exact path="/khuyen-mai" component={ProductPromotion} />
        <Route exact path="/tin-tuc" component={NewsManager} />
        <Route exact path="/tuyen-dung" component={CareerManager} />
        <Route exact path="/don-hang" component={CartManager} />
        <Route exact path="/setting" component={Setting} />
        <Route exact path="/menu-admin" component={MenuManager} />
        <Route exact path="/menu-website" component={MenuWebsiteManager} />
        <Route exact path="/slide" component={SlideManager} />
        <Route exact path="/xu-ly-lien-he" component={Contact} />
        <Route exact path="/giam-gia" component={Voucher} />
        <Route exact path="/khach-hang" component={Customer} />
        <Route exact path="/tai-khoan" component={UsersManager} />
        <Route exact path="/ban-hang" component={SellManager} />
        <Route exact path="/nhom-khach-hang" component={GroupUsers} />
        <Route exact path="/dich-vu" component={Service} />
        <Route exact path="/them-ngon-ngu" component={Language} />
        <Route exact path="/chi-tiet-ngon-ngu" component={LanguageDetails} />
      </Switch>
    </BrowserRouter>
  );
};
