import { useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";

export const Dashboard = () => {
  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row g-4">
          <div className="col-xl-9 cardcus mt-3">
            <div className="row ">
              <h3 className="text-center mb-4">Thống kê chung</h3>
              <div className="col-xl-3 col-lg-6" style={{ cursor: 'pointer' }}>
                <div className="card-status l-bg-cherry">
                  <div className="card-statistic-3 p-4">
                    <div className="card-icon card-icon-large"><i className="fas fa-shopping-cart" /></div>
                    <div className="mb-4">
                      <h5 className="card-title mb-0">Đơn đặt hàng</h5>
                    </div>
                    <div className="row align-items-center mb-2 d-flex">
                      <div className="col-8">
                        <h2 className="d-flex align-items-center mb-0">
                          3
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6" style={{ cursor: 'pointer' }}>
                <div className="card-status l-bg-blue-dark">
                  <div className="card-statistic-3 p-4">
                    <div className="card-icon card-icon-large"><i className="fa-duotone fa--medical"></i></div>
                    <div className="mb-4">
                      <h5 className="card-title mb-0">Khách hàng mới</h5>
                    </div>
                    <div className="row align-items-center mb-2 d-flex">
                      <div className="col-8">
                        <h2 className="d-flex align-items-center mb-0">
                          4
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6" style={{ cursor: 'pointer' }}>
                <div className="card-status l-bg-green-dark">
                  <div className="card-statistic-3 p-4">
                    <div className="card-icon card-icon-large"><i class="fa-regular fa-comment-lines"></i></div>
                    <div className="mb-4">
                      <h5 className="card-title mb-0">Khách hàng liên hệ</h5>
                    </div>
                    <div className="row align-items-center mb-2 d-flex">
                      <div className="col-8">
                        <h2 className="d-flex align-items-center mb-0">
                          4
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6" style={{ cursor: 'pointer' }}>
                <div className="card-status l-bg-orange-dark">
                  <div className="card-statistic-3 p-4">
                    <div className="card-icon card-icon-large"><i class="fa-sharp fa-solid fa-cart-flatbed-boxes"></i></div>
                    <div className="mb-4">
                      <h5 className="card-title mb-0">Tổng sản phẩm</h5>
                    </div>
                    <div className="row align-items-center mb-2 d-flex">
                      <div className="col-8">
                        <h2 className="d-flex align-items-center mb-0">
                          30
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 border-bottom-dash"></div>

            <div className="row">
              <div className="col-12">
                <h3 className="text-center">...</h3>
              </div>
            </div>
          </div>

          <div class="col-xl-3">
            <div className="cardcus" >
              <h3>Lịch sử hoạt động</h3>
              <ul class="timeline">
                <li>
                  <a target="_blank" href="https://www.totoprayogo.com/#">New Web Design</a>
                  <a href="#" class="float-right">21 March, 2014</a>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula....</p>
                </li>
                <li>
                  <a href="#">21 000 Job Seekers</a>
                  <a href="#" class="float-right">4 March, 2014</a>
                  <p>Curabitur purus sem, malesuada eu luctus eget, suscipit sed turpis. Nam pellentesque felis vitae justo accumsan, sed semper nisi sollicitudin...</p>
                </li>
                <li>
                  <a href="#">Awesome Employers</a>
                  <a href="#" class="float-right">1 April, 2014</a>
                  <p>Fusce ullamcorper ligula sit amet quam accumsan aliquet. Sed nulla odio, tincidunt vitae nunc vitae, mollis pharetra velit. Sed nec tempor nibh...</p>
                </li>
                <li>
                  <a href="#">Awesome Employers</a>
                  <a href="#" class="float-right">1 April, 2014</a>
                  <p>Fusce ullamcorper ligula sit amet quam accumsan aliquet. Sed nulla odio, tincidunt vitae nunc vitae, mollis pharetra velit. Sed nec tempor nibh...</p>
                </li>
                <li>
                  <a href="#">Awesome Employers</a>
                  <a href="#" class="float-right">1 April, 2014</a>
                  <p>Fusce ullamcorper ligula sit amet quam accumsan aliquet. Sed nulla odio, tincidunt vitae nunc vitae, mollis pharetra velit. Sed nec tempor nibh...</p>
                </li>
                <li>
                  <a href="#">Awesome Employers</a>
                  <a href="#" class="float-right">1 April, 2014</a>
                  <p>Fusce ullamcorper ligula sit amet quam accumsan aliquet. Sed nulla odio, tincidunt vitae nunc vitae, mollis pharetra velit. Sed nec tempor nibh...</p>
                </li>
                <li>
                  <a href="#">Awesome Employers</a>
                  <a href="#" class="float-right">1 April, 2014</a>
                  <p>Fusce ullamcorper ligula sit amet quam accumsan aliquet. Sed nulla odio, tincidunt vitae nunc vitae, mollis pharetra velit. Sed nec tempor nibh...</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
