FROM node:20-alpine
RUN npm config set registry https://registry.npmmirror.com
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
# EXPOSE 3000
