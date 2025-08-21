'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Project, Task, TaskStatus } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch, Timestamp, onSnapshot } from "firebase/firestore";

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  findProject: (projectId: string) => Project | undefined;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>;
  addTask: (projectId: string, parentTaskId: string | null, taskTitle: string, quantity: number, unitPrice: number) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const processFirestoreProjects = (docs: any[]): Project[] => {
    return docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        startDate: (data.startDate as Timestamp)?.toDate(),
        endDate: (data.endDate as Timestamp)?.toDate(),
        tasks: processFirestoreTasks(data.tasks || [])
      } as Project;
    });
  }
  
  const processFirestoreTasks = (tasks: any[]): Task[] => {
      return tasks.map(task => ({
          ...task,
          lastUpdated: task.lastUpdated, // Should already be ISO string
          subTasks: task.subTasks ? processFirestoreTasks(task.subTasks) : []
      }));
  }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (querySnapshot) => {
        const projectsData = processFirestoreProjects(querySnapshot.docs);
        setProjects(projectsData);
        setLoading(false);
    });

    return () => unsub();
  }, []);


  const findProject = useCallback((projectId: string) => {
    return projects.find((p) => p.id === projectId);
  }, [projects]);
  
  const addProject = async (project: Omit<Project, 'id' | 'tasks'>) => {
    const batch = writeBatch(db);
    const newProjectRef = doc(collection(db, "projects"));
    
    batch.set(newProjectRef, {
        ...project,
        tasks: [],
    });

    await batch.commit();
  };

  const updateTaskStatus = async (projectId: string, taskId: string, status: TaskStatus) => {
    const projectRef = doc(db, "projects", projectId);
    const projectData = findProject(projectId);
    if (!projectData) return;

    const updateRecursive = (tasks: Task[]): Task[] => {
      return tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status, lastUpdated: new Date().toISOString() };
        }
        if (task.subTasks && task.subTasks.length > 0) {
          return { ...task, subTasks: updateRecursive(task.subTasks) };
        }
        return task;
      });
    };

    const newTasks = updateRecursive(projectData.tasks);
    const batch = writeBatch(db);
    batch.update(projectRef, { tasks: newTasks });
    await batch.commit();
  };
  
  const addTask = async (projectId: string, parentTaskId: string | null, taskTitle: string, quantity: number, unitPrice: number) => {
    const projectRef = doc(db, "projects", projectId);
    const projectData = findProject(projectId);
    if (!projectData) return;
    
    const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        status: 'Pending',
        lastUpdated: new Date().toISOString(),
        subTasks: [],
        quantity: quantity,
        unitPrice: unitPrice,
        value: quantity * unitPrice,
      };

    const addRecursive = (tasks: Task[]): Task[] => {
        if (parentTaskId === null) {
            return [...tasks, newTask];
        }
        return tasks.map(task => {
            if (task.id === parentTaskId) {
                return {...task, subTasks: [...task.subTasks, newTask]};
            }
            if (task.subTasks && task.subTasks.length > 0) {
                return {...task, subTasks: addRecursive(task.subTasks)};
            }
            return task;
        });
    };
    
    const newTasks = addRecursive(projectData.tasks);
    const batch = writeBatch(db);
    batch.update(projectRef, { tasks: newTasks });
    await batch.commit();
  }

  return (
    <ProjectContext.Provider value={{ projects, loading, addProject, findProject, updateTaskStatus, addTask }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
