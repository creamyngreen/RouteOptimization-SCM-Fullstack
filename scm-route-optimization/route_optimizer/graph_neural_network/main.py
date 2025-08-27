import torch
import torch.nn.functional as F
import torch.nn as nn
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
import datetime
import pandas as pd
import os
import sys
from datetime import datetime
from tqdm import tqdm


current_file_path = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(current_file_path))
if project_root not in sys.path:
    sys.path.append(project_root)

from routes_selection import hard_route

model_configs = {
    'learning_rate':0.1,
    'epochs':100,
    'penalty_factor': 1000 # set to a test num
}

class RouteOptimizerGCN(nn.Module):
    def __init__(self, num_features):
        super(RouteOptimizerGCN, self).__init__()
        self.conv1 = GCNConv(num_features, 32)
        self.conv2 = GCNConv(32, 32)
        self.fc = nn.Linear(32, 1)

    def forward(self, data):
        x, edge_index = data.x, data.edge_index
        x = F.relu(self.conv1(x, edge_index))
        x = F.dropout(x, training=self.training)
        x = F.relu(self.conv2(x, edge_index))
        scores = self.fc(x).squeeze()
        return scores

    def select_routes(self, scores, data, demand, available_hours, routes_data_df):
        probabilities = torch.sigmoid(scores)
        sorted_indices = torch.argsort(probabilities, descending=True)

        total_weight = 0
        total_cost = 0
        selected_routes = []

        for idx in sorted_indices:
            idx = idx.item()

            route = routes_data_df.iloc[idx]

            if total_weight >= demand:
                break  

            if route['travel_hours'] > available_hours:
                continue 
            selected_routes.append(idx)
            total_weight += route['weight']
            total_cost += route['total_cost']

        # print("Selected routes:", selected_routes)
        # print("Total cost:", total_cost)
        # print("Total weight:", total_weight)

        if total_weight >= demand:

            return selected_routes, total_cost  
        else:
            return None, float('inf')

def optimize(routes_data, demand, deadline, args=model_configs):
    node_features = []
    for route in routes_data:
        node_features.append([
            route['weight'],
            route['travel_hours']
        ])
    routes_data_df = pd.DataFrame(routes_data)
    routes_data_df['idx'] = range(len(routes_data))

    x = torch.tensor(node_features, dtype=torch.float)
    num_nodes = len(routes_data)
    edge_index = torch.combinations(torch.arange(num_nodes), r=2).T

    data = Data(x=x, edge_index=edge_index)
    model = RouteOptimizerGCN(num_features=x.shape[1])
    optimizer = torch.optim.SGD(model.parameters(), lr=args['learning_rate'])

    current_time = datetime.now()
    deadline_datetime = datetime.combine(deadline, datetime.min.time())
    total_available_hours = (deadline_datetime - current_time).total_seconds() / 3600

    model.train()
    best_selected_indices = None
    best_total_cost = float('inf')

    for epoch in tqdm(range(args['epochs'])):
        optimizer.zero_grad()
        
        scores = model(data)
        selected_indices, total_cost = model.select_routes(scores, data, demand, total_available_hours, routes_data_df)
        
        loss = torch.tensor(total_cost, dtype=torch.float, requires_grad=True)
        if selected_indices is not None:
            total_weight = sum(routes_data_df.iloc[idx]['weight'] for idx in selected_indices)
            total_travel_hours = max(routes_data_df.iloc[idx]['travel_hours'] for idx in selected_indices)

            if total_weight < demand:
                demand_penalty = (demand - total_weight) * args['penalty_factor']
                loss += demand_penalty
            if total_travel_hours > total_available_hours:
                deadline_penalty = (total_travel_hours - total_available_hours) * args['penalty_factor']
                loss += deadline_penalty
            
            if total_weight >= demand and total_cost < best_total_cost:
                best_selected_indices = selected_indices
                best_total_cost = total_cost

            loss.backward()
            optimizer.step()

    model.eval()
    with torch.no_grad():
        scores = model(data)
        selected_indices, total_cost = model.select_routes(scores, data, demand, total_available_hours, routes_data_df)
        
    final_selected_indices = selected_indices if selected_indices else best_selected_indices
    if final_selected_indices:
        selected_routes_df = routes_data_df.iloc[final_selected_indices]
        selected_routes_list = selected_routes_df.to_dict(orient='records')
        return selected_routes_list
    else:
        print("No feasible plan meets the demand.")
        return None


if __name__ == '__main__':
    demand = 5

    sample_dest = '5/219, Đ. Thủ Khoa Huân/Tổ 4A Đ.Đ1, Thuận Giao, Thuận An, Bình Dương 75000'
    routes = hard_route[sample_dest]
    routes = [route for route in routes if route['travel_kms'] !=0.0]
    deadline = datetime(2024, 11, 29).date() 
    selected_routes = optimize(routes_data=routes, demand=demand, deadline=deadline, args=model_configs)
    print(selected_routes)