from pulp import LpMinimize, LpProblem, LpVariable, lpSum, value
import pandas as pd
from datetime import datetime
import os
import sys
current_file_path = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(current_file_path))
if project_root not in sys.path:
    sys.path.append(project_root)

from data_collection import suppliers, parkings, vehicles
from routes_selection import route_selection


def main(suppliers, parkings, vehicles, destination, demand, deadline):
    date_now = datetime.now().date()
    max_travel_days = (deadline - date_now).days + 1

    # Get route data
    routes_data = route_selection(suppliers=suppliers, parking_areas=parkings, destination=destination, vehicles=vehicles)
    
    # Linear Programming Problem Setup
    prob = LpProblem("DeliveryPlanOptimization", LpMinimize)
    num_routes = len(routes_data)
    
    # Define decision variables
    route_vars = [LpVariable(f'route_{i}', cat='Binary') for i in range(num_routes)]
    
    # Objective Function: Minimize total cost (driver + fuel + goods costs)
    total_cost = lpSum([
        route_vars[i] * (routes_data[i]['driver_cost'] + routes_data[i]['fuel_cost'] + routes_data[i]['goods_cost'])
        for i in range(num_routes)
    ])
    prob += total_cost

    # Constraint: Total weight must meet or exceed the demand
    prob += lpSum([route_vars[i] * routes_data[i]['weight'] for i in range(num_routes)]) >= demand

    # Constraint: Only one route per supplier can be selected
    suppliers_routes = {routes_data[i]['supplier_id']: [] for i in range(num_routes)}
    for i in range(num_routes):
        suppliers_routes[routes_data[i]['supplier_id']].append(route_vars[i])

    for supplier_routes in suppliers_routes.values():
        prob += lpSum(supplier_routes) <= 1

    # Constraint: Total travel time must fit within max travel days
    prob += lpSum([route_vars[i] * (routes_data[i]['travel_hours'] // 8 + 1) for i in range(num_routes)]) <= max_travel_days

    # Solve the problem
    prob.solve()

    # Extract the selected routes in original format
    selected_routes = [routes_data[i] for i in range(num_routes) if route_vars[i].varValue == 1]
    
    # Print the selected routes
    print("Selected Routes:", selected_routes)
    
    return selected_routes


def optimize(routes_data, demand, deadline):
    date_now = datetime.now().date()
    max_travel_days = (deadline - date_now).days + 1

    # Linear Programming Problem Setup
    prob = LpProblem("DeliveryPlanOptimization", LpMinimize)
    num_routes = len(routes_data)
    # print('Number of routes: ',num_routes)
    
    # Define decision variables
    route_vars = [LpVariable(f'route_{i}', cat='Binary') for i in range(num_routes)]
    # print('Route variables: ', route_vars)
    # print('Route variables datatype: ', type(route_vars[0]))
    
    # Objective Function: Minimize total cost (driver + fuel + goods costs)
    total_cost = lpSum([
        route_vars[i] * (routes_data[i]['driver_cost'] + routes_data[i]['fuel_cost'] + routes_data[i]['goods_cost'])
        for i in range(num_routes)
    ])
    prob += total_cost
    # print(total_cost)

    # Constraint: Total weight must meet or exceed the demand
    prob += lpSum([route_vars[i] * routes_data[i]['weight'] for i in range(num_routes)]) >= demand
    
    # Solve the problem
    prob.solve()
    # print('Objective: ', value(prob.objective))

    # Extract the selected routes in original format
    selected_routes = [routes_data[i] for i in range(num_routes) if route_vars[i].varValue == 1]
    
    # Print the selected routes
    # print("Selected Routes:", selected_routes)
    
    return selected_routes


if __name__ == '__main__':
    destination = {
        'id': 'DESTINATION_TEST',
        'address': 'ĐT 746, Xã Đât Cuốc, huyện Bắc tân Uyên, Tỉnh Bình Dương Tân Uyên 75358 Bình Dương',
    }
    route_data = [{'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 22084.2701108176, 'total_cost': 75571.00874718123, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 19875.84309973584, 'total_cost': 73362.58173609947, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 16563.2025831132, 'total_cost': 70049.94121947684, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 9937.92154986792, 'total_cost': 63424.66018623155, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 8833.70804432704, 'total_cost': 62320.44668069067, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 60101.885227666615, 'total_cost': 108991.45113675753, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 54091.69670489996, 'total_cost': 102981.26261399087, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 45076.41392074996, 'total_cost': 93965.97982984087, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 27045.84835244998, 'total_cost': 75935.4142615409, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 24040.754091066647, 'total_cost': 72930.32000015756, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 76679.9911036602, 'total_cost': 125400.73428547838, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 69011.99199329418, 'total_cost': 117732.73517511236, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 57509.99332774516, 'total_cost': 106230.73650956334, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 34505.99599664709, 'total_cost': 83226.73917846527, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 30671.99644146408, 'total_cost': 79392.73962328226, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 62647.4100326929, 'total_cost': 112082.40321451108, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 56382.6690294236, 'total_cost': 105817.66221124178, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 46985.557524519674, 'total_cost': 96420.55070633785, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 28191.3345147118, 'total_cost': 77626.32769652997, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 25058.96401307716, 'total_cost': 74493.95719489534, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 79520.09199346698, 'total_cost': 128987.55108437607, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 71568.08279412027, 'total_cost': 121035.54188502936, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 59640.068995100235, 'total_cost': 109107.52808600932, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 35784.04139706014, 'total_cost': 85251.50048796923, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 31808.03679738679, 'total_cost': 81275.49588829587, 'travel_hours': 4.47, 'travel_kms': 0.226}]
    demand = 100 
    deadline = datetime(2023, 12, 31).date()  
    # main(suppliers=suppliers, parkings=parkings, vehicles=vehicles,
    #      destination=destination, demand=demand, deadline=deadline)
    print(optimize(routes_data=route_data, demand=demand, deadline=deadline))
