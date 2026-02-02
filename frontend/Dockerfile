FROM node:18

WORKDIR /app
RUN npm install -g serve

COPY . .

EXPOSE 3000
CMD ["serve", "-l", "3000"]

